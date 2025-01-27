import { authenticator } from "otplib";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

interface BaseResponse<T = any> {
  status: boolean;
  message: string;
  data: T | null;
  error?: string;
}

const createResponse = <T>(
  status: boolean,
  message: string,
  data: T | null,
  error?: string
): BaseResponse<T> => {
  return {
    status,
    message,
    data,
    ...(error && { error }),
  };
};

const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error hashing password:", error);
      throw new Error(`Failed to hash password: ${error.message}`);
    }
    throw new Error("Failed to hash password: Unknown error occurred");
  }
};

const verifyPassword = async (
  password: string,
  hash: string
): Promise<BaseResponse<boolean>> => {
  try {
    const isValid = await bcrypt.compare(password, hash);
    return createResponse(
      true,
      isValid ? "Password verified" : "Invalid password",
      isValid
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error verifying password:", error);
      return createResponse(
        false,
        "Failed to verify password",
        false,
        error.message
      );
    }
    return createResponse(
      false,
      "Failed to verify password",
      false,
      "Unknown error occurred"
    );
  }
};

const validateOTP = (token: string, secret: string): BaseResponse<boolean> => {
  try {
    const isValid = authenticator.verify({ token, secret });
    return createResponse(
      true,
      isValid ? "OTP verified" : "Invalid OTP",
      isValid
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error validating OTP:", error);
      return createResponse(
        false,
        "Failed to validate OTP",
        false,
        error.message
      );
    }
    return createResponse(
      false,
      "Failed to validate OTP",
      false,
      "Unknown error occurred"
    );
  }
};

const generateOTPSecret = (): string => {
  return authenticator.generateSecret();
};

const generateOTPCode = (secret: string): string => {
  return authenticator.generate(secret);
};

async function sendOTP(email: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.verify();

    const secret = generateOTPSecret();
    const otp = generateOTPCode(secret);

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
      html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
    };

    await transporter.sendMail(mailOptions);

    return { secret, otp };
  } catch (error) {
    console.error("Error sending OTP:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to send OTP: ${error.message}`);
    }
    throw new Error("Failed to send OTP: Unknown error");
  }
}

export {
  BaseResponse,
  createResponse,
  hashPassword,
  verifyPassword,
  validateOTP,
  generateOTPSecret,
  generateOTPCode,
  sendOTP,
};
