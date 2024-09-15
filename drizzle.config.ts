import "dotenv-expand/config";

import { createEnv } from "@t3-oss/env-core";
import { defineConfig } from "drizzle-kit";
import { z } from "zod";

console.log(process.env);
console.log(process.env.DATABASE_URL);

const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().min(1),
  },
  runtimeEnv: process.env,
});

export default defineConfig({
  dialect: "postgresql",
  out: "./src/drizzle",
  schema: "./src/drizzle/schema.ts",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
});
