import { createPool, type Pool } from "mysql2/promise";
import { drizzle } from "drizzle-orm/singlestore";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

export const conn =
  globalForDb.conn ??
  createPool({
    host: String(env.SINGLESTORE_HOST),
    user: String(env.SINGLESTORE_USER),
    password: String(env.SINGLESTORE_PASSWORD),
    port: Number(env.SINGLESTORE_PORT),
    database: String(env.SINGLESTORE_DB_NAME),
    ssl: {},
    maxIdle: 0,
  });
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

conn.addListener("error", (err) => {
  console.error("Database connection error: ", err);
});

export const db = drizzle(conn, { schema });
