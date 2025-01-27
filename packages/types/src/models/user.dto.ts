import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  otpSecret: z.string().min(1),
  isActivated: z.boolean().default(false),
  role: z.string().default("user"),
});

export type UserType = z.infer<typeof UserSchema>;
