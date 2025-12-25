import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "singlestore",
  dbCredentials: {
    host: String(env.SINGLESTORE_HOST),
    user: String(env.SINGLESTORE_USER),
    password: String(env.SINGLESTORE_PASSWORD),
    port: Number(env.SINGLESTORE_PORT),
    database: String(env.SINGLESTORE_DB_NAME),
    ssl: {},
  },
  tablesFilter: ["ma-drive_*"] as string[],
} satisfies Config;
