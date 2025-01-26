import { z } from "zod";
import { UserSchema } from "./user";

export const EndpointSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  user: z.object({
    ...UserSchema.shape,
  }),
  checkInterval: z.number().default(300000),
  timeout: z.number().default(10000),
  status: z.enum(["active", "warning", "down"]).default("active"),
  lastChecked: z.date().default(new Date()),
  responseTime: z.number().default(0),
  availability: z.number().default(100),
});

export type Endpoint = z.infer<typeof EndpointSchema>;
