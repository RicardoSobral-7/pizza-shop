import { z } from "zod";

// env será para fazer delay apenas nas requisições
const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_ENABLE_API_DELAY: z.string().transform((value) => value === "true"),
});

export const env = envSchema.parse(import.meta.env);
