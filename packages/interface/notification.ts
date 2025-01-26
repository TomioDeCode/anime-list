import { EndpointSchema } from "./endpoint";
import { UserSchema } from "./user";
import { z } from "zod";

export const NotificationSchema = z.object({
  user: z.object({
    ...UserSchema.shape,
  }),
  endpoint: z.object({
    ...EndpointSchema.shape,
  }),
  type: z.enum(["down", "slowResponse", "recovered"]),
  message: z.string(),
  read: z.boolean().default(false),
  timestamp: z.date().default(new Date()),
});

export type Notification = z.infer<typeof NotificationSchema>;
