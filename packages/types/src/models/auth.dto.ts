import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

export const verifyOTPSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type RegisterType = z.infer<typeof registerSchema>;
export type VerifyOTPType = z.infer<typeof verifyOTPSchema>;
export type LoginType = z.infer<typeof loginSchema>;
