import { sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { type getTags } from "@/lib/api/tags/queries"

import "react-native-get-random-values"

import { timestamps } from "@/lib/utils"
import { v4 as uuid } from "uuid"

export const tags = sqliteTable("tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuid()),
  title: text("title").notNull(),

  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

// Schema for tags - used to validate API requests
const baseSchema = createSelectSchema(tags).omit(timestamps)

export const insertTagSchema = createInsertSchema(tags).omit(timestamps)
export const insertTagParams = baseSchema.extend({}).omit({
  id: true,
})

export const updateTagSchema = baseSchema
export const updateTagParams = baseSchema.extend({})
export const tagIdSchema = baseSchema.pick({ id: true })

// Types for tags - used to type API request params and within Components
export type Tag = typeof tags.$inferSelect
export type NewTag = z.infer<typeof insertTagSchema>
export type NewTagParams = z.infer<typeof insertTagParams>
export type UpdateTagParams = z.infer<typeof updateTagParams>
export type TagId = z.infer<typeof tagIdSchema>["id"]

// this type infers the return from getTags() - meaning it will include any joins
export type CompleteTag = Awaited<ReturnType<typeof getTags>>["tags"][number]
