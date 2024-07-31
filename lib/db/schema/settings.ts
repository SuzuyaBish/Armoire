import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { type getSettings } from "@/lib/api/settings/queries"

import "react-native-get-random-values"

import { timestamps } from "@/lib/utils"
import { v4 as uuid } from "uuid"

export const settings = sqliteTable("settings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuid()),
  onboardingSeen: integer("onboarding_seen", { mode: "boolean" })
    .notNull()
    .default(false),

  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

// Schema for settings - used to validate API requests
const baseSchema = createSelectSchema(settings).omit(timestamps)

export const insertSettingSchema = createInsertSchema(settings).omit(timestamps)
export const insertSettingParams = baseSchema
  .extend({
    onboardingSeen: z.coerce.boolean(),
  })
  .omit({
    id: true,
  })

export const updateSettingSchema = baseSchema
export const updateSettingParams = baseSchema.extend({
  onboardingSeen: z.coerce.boolean(),
})
export const settingIdSchema = baseSchema.pick({ id: true })

// Types for settings - used to type API request params and within Components
export type Setting = typeof settings.$inferSelect
export type NewSetting = z.infer<typeof insertSettingSchema>
export type NewSettingParams = z.infer<typeof insertSettingParams>
export type UpdateSettingParams = z.infer<typeof updateSettingParams>
export type SettingId = z.infer<typeof settingIdSchema>["id"]

// this type infers the return from getSettings() - meaning it will include any joins
export type CompleteSetting = Awaited<
  ReturnType<typeof getSettings>
>["settings"][number]
