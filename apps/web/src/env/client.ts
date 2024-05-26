import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    // ADD_CLIENT_ENV_VARIABLES_HERE: process.env.ADD_CLIENT_ENV_VARIABLES_HERE,
  },
  experimental__runtimeEnv: {
    // ADD_CLIENT_ENV_VARIABLES_HERE: process.env.ADD_CLIENT_ENV_VARIABLES_HERE,
  },
});
