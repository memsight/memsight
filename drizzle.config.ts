import type { Config } from "drizzle-kit";
export default {
  schema: "./src/schema/schema.ts",
  out: "./migrations",
  driver: 'd1',
  dbCredentials: {
    wranglerConfigPath: 'wrangler.toml',
    dbName: "memsight"
  }
} satisfies Config;