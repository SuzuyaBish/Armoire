import { sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import "react-native-get-random-values"

import { type getCollections } from "@/lib/api/collections/queries"
import { v4 as uuid } from "uuid"

import { timestamps } from "@/lib/utils"

export const collections = sqliteTable("collections", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text("name").notNull(),

  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

// Schema for collections - used to validate API requests
const baseSchema = createSelectSchema(collections).omit(timestamps)

export const insertCollectionSchema =
  createInsertSchema(collections).omit(timestamps)
export const insertCollectionParams = baseSchema.extend({}).omit({
  id: true,
})

export const updateCollectionSchema = baseSchema
export const updateCollectionParams = baseSchema.extend({})
export const collectionIdSchema = baseSchema.pick({ id: true })

// Types for collections - used to type API request params and within Components
export type Collection = typeof collections.$inferSelect
export type NewCollection = z.infer<typeof insertCollectionSchema>
export type NewCollectionParams = z.infer<typeof insertCollectionParams>
export type UpdateCollectionParams = z.infer<typeof updateCollectionParams>
export type CollectionId = z.infer<typeof collectionIdSchema>["id"]

// this type infers the return from getCollections() - meaning it will include any joins
export type CompleteCollection = Awaited<
  ReturnType<typeof getCollections>
>["collections"][number]
