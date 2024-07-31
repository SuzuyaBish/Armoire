import { type getFiles } from "@/lib/api/files/queries"
import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { collections } from "./collections"

import "react-native-get-random-values"

import { timestamps } from "@/lib/utils"
import { v4 as uuid } from "uuid"

export const files = sqliteTable("files", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuid()),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type").notNull(),
  aspect_ratio: integer("aspect_ratio"),
  collectionId: text("collection_id")
    .references(() => collections.id, { onDelete: "cascade" })
    .notNull(),

  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

// Schema for files - used to validate API requests
const baseSchema = createSelectSchema(files).omit(timestamps)

export const insertFileSchema = createInsertSchema(files).omit(timestamps)
export const insertFileParams = baseSchema
  .extend({
    collectionId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  })

export const updateFileSchema = baseSchema
export const updateFileParams = baseSchema.extend({
  collectionId: z.coerce.string().min(1),
})
export const fileIdSchema = baseSchema.pick({ id: true })
export const fileWithThumbailSchema = baseSchema.extend({
  thumbnail: z.string().optional(),
})

// Types for files - used to type API request params and within Components
export type File = typeof files.$inferSelect
export type NewFile = z.infer<typeof insertFileSchema>
export type NewFileParams = z.infer<typeof insertFileParams>
export type UpdateFileParams = z.infer<typeof updateFileParams>
export type FileId = z.infer<typeof fileIdSchema>["id"]
export type FileWithThumbnail = z.infer<typeof fileWithThumbailSchema>

// this type infers the return from getFiles() - meaning it will include any joins
export type CompleteFile = Awaited<ReturnType<typeof getFiles>>["files"][number]
