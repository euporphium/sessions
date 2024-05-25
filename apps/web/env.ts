import { z } from 'zod';

const envSchema = z.object({
  KINDE_CLIENT_ID: z.string().min(1),
  KINDE_CLIENT_SECRET: z.string().min(1),
  KINDE_ISSUER_URL: z.string().url(),
  KINDE_SITE_URL: z.string().url(),
  KINDE_POST_LOGOUT_REDIRECT_URL: z.string().url(),
  KINDE_POST_LOGIN_REDIRECT_URL: z.string().url(),

  POSTGRES_HOST: z.string().url(),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
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
