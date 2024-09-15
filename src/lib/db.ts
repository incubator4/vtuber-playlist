import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "@/drizzle/schema";
import * as relations from "@/drizzle/relations";

import { env } from "./env";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: {
    ...schema,
    ...relations,
  },
});
