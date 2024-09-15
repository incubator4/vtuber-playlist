import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "@/drizzle/schema";
import * as relations from "@/drizzle/relations";

console.log(process.env);
console.log(process.env.DATABASE_URL);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: {
    ...schema,
    ...relations,
  },
});
