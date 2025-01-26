import { z } from "zod";
import { EndpointSchema } from "./endpoint";

export const MonitorLogSchema = z.object({
  endpoint: z.object({
    ...EndpointSchema.shape,
  }),
  timestamp: z.date().default(new Date()),
  statusCode: z.number(),
  responseTime: z.number(),
  success: z.boolean(),
  errorMessage: z.string().optional(),
  errorType: z.string().optional(),
});

export type MonitorLog = z.infer<typeof MonitorLogSchema>;
