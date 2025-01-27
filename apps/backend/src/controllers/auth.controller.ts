import { Hono } from "hono";
import { z } from "zod";
import * as jwt from "jsonwebtoken";
import prisma from "src/libs/prisma";
import {
  hashPassword,
  verifyPassword,
  validateOTP,
  generateOTPSecret,
  createResponse,
  sendOTP,
} from "../services/auth.service";
import { registerSchema, loginSchema, verifyOTPSchema } from "@repo/types";

const authApi = new Hono();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "3d";

authApi.post("/register", async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = registerSchema.parse(body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username },
        ],
      },
    });

    if (existingUser) {
      return c.json(
        createResponse(false, "User already exists", null, "DUPLICATE_USER"),
        409
      );
    }

    const hashedPassword = await hashPassword(validatedData.password);
    const otpSecret = generateOTPSecret();

    const newUser = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,
        otpSecret: otpSecret,
        isActivated: false,
        role: "USER",
      },
      select: {
        id: true,
        username: true,
        email: true,
        isActivated: true,
        role: true,
      },
    });

    try {
      await sendOTP(validatedData.email);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      await prisma.user.delete({
        where: { id: newUser.id },
      });
      return c.json(
        createResponse(
          false,
          "Failed to send verification email. Please try again later.",
          null,
          "EMAIL_SENDING_FAILED"
        ),
        500
      );
    }

    return c.json(
      createResponse(
        true,
        "Registration successful. Please check your email for OTP verification.",
        {
          user: newUser,
          otpSecret: otpSecret,
        }
      ),
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        createResponse(false, "Validation failed", null, error.errors as any),
        400
      );
    }

    console.error("Registration error:", error);
    return c.json(
      createResponse(
        false,
        "Failed to register user",
        null,
        error instanceof Error ? error.message : "Unknown error occurred"
      ),
      500
    );
  }
});

authApi.post("/verify-otp", async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = verifyOTPSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return c.json(
        createResponse(false, "User not found", null, "USER_NOT_FOUND"),
        404
      );
    }

    const otpValidation = validateOTP(validatedData.code, user.otpSecret);

    if (!otpValidation.data) {
      return c.json(
        createResponse(false, "Invalid OTP code", null, "INVALID_OTP"),
        400
      );
    }

    if (!user.isActivated) {
      await prisma.user.update({
        where: { email: user.email },
        data: { isActivated: true },
      });
    }

    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return c.json(
      createResponse(true, "OTP verified successfully", {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          isActivated: true,
        },
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        createResponse(false, "Validation failed", null, error.errors as any),
        400
      );
    }

    console.error("OTP verification error:", error);
    return c.json(
      createResponse(
        false,
        "Failed to verify OTP",
        null,
        error instanceof Error ? error.message : "Unknown error occurred"
      ),
      500
    );
  }
});

authApi.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return c.json(
        createResponse(
          false,
          "Invalid credentials",
          null,
          "INVALID_CREDENTIALS"
        ),
        401
      );
    }

    const passwordValidation = await verifyPassword(
      validatedData.password,
      user.password
    );

    if (!passwordValidation.data) {
      return c.json(
        createResponse(
          false,
          "Invalid credentials",
          null,
          "INVALID_CREDENTIALS"
        ),
        401
      );
    }

    if (!user.isActivated) {
      return c.json(
        createResponse(
          false,
          "Account not activated",
          null,
          "ACCOUNT_NOT_ACTIVATED"
        ),
        403
      );
    }

    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return c.json(
      createResponse(true, "Login successful", {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          isActivated: user.isActivated,
        },
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        createResponse(false, "Validation failed", null, error.errors as any),
        400
      );
    }

    console.error("Login error:", error);
    return c.json(
      createResponse(
        false,
        "Failed to login",
        null,
        error instanceof Error ? error.message : "Unknown error occurred"
      ),
      500
    );
  }
});

async function handleOTPRequest(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    await sendOTP(email);

    return new Response(
      JSON.stringify({
        message: "OTP sent successfully",
        success: true,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("OTP request error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to send OTP",
        success: false,
      }),
      {
        status: 500,
      }
    );
  }
}

export default authApi;
