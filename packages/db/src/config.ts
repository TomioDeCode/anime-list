import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  MONGO_URI: z.string(),
});

const env = envSchema.parse({
  MONGO_URI: process.env.MONGO_URI,
});

export const config = {
  mongodb: {
    url: env.MONGO_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};
