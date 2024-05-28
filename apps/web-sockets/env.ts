import { z } from 'zod';

const envSchema = z.object({
  LOG_LEVEL: z.string(),
  PORT: z.string(),
  CORS_ORIGIN: z.string().url(),
});

export type Environment = z.infer<typeof envSchema>;

// This will throw an error if any of the environment variables are missing or invalid
const validatedEnv = envSchema.safeParse(process.env);

if (!validatedEnv.success) {
  console.error(validatedEnv.error.flatten());
  throw new Error('Invalid environment variables');
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Environment {}
  }
}

export default validatedEnv.data;
