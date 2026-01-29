import * as schema from "./schema";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

// When using Supabase as the Postgres host, SSL is typically required.
// The Supabase connection string already includes sslmode=require, but
// we also pass an explicit ssl option for environments that need it.
const client = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
});

export const db = drizzle(client, { schema });
