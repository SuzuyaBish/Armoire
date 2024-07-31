import type { Config } from "drizzle-kit"

export default {
  schema: "./lib/db/schema",
  out: "./lib/db/migrations",
  dialect: "sqlite",
  driver: "expo",
} satisfies Config
