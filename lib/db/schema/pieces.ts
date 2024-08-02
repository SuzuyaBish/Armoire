import { type getPieces } from "@/lib/api/pieces/queries"
import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import "react-native-get-random-values"

import { timestamps } from "@/lib/utils"
import { v4 as uuid } from "uuid"

export const pieces = sqliteTable("pieces", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuid()),
  title: text("title"),
  tags: text("tags"),
  filePath: text("file_path").notNull(),
  aspect_ratio: integer("aspect_ratio"),
  collections: text("collection_id").notNull(),
  age: integer("age", { mode: "timestamp" }),
  favorited: integer("favorite", { mode: "boolean" }).default(false),
  archived: integer("archived", { mode: "boolean" }),

  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

// Schema for pieces - used to validate API requests
const baseSchema = createSelectSchema(pieces).omit(timestamps)

export const insertPieceSchema = createInsertSchema(pieces).omit(timestamps)
export const insertPieceParams = baseSchema
  .extend({
    collections: z.coerce.string().min(1),
    age: z.coerce.date(),
    archived: z.coerce.boolean(),
  })
  .omit({
    id: true,
  })

export const updatePieceSchema = baseSchema
export const updatePieceParams = baseSchema.extend({
  collections: z.coerce.string().min(1),
  age: z.coerce.date(),
  archived: z.coerce.boolean(),
})
export const pieceIdSchema = baseSchema.pick({ id: true })

// Types for pieces - used to type API request params and within Components
export type Piece = typeof pieces.$inferSelect
export type NewPiece = z.infer<typeof insertPieceSchema>
export type NewPieceParams = z.infer<typeof insertPieceParams>
export type UpdatePieceParams = z.infer<typeof updatePieceParams>
export type PieceId = z.infer<typeof pieceIdSchema>["id"]

// this type infers the return from getPieces() - meaning it will include any joins
export type CompletePiece = Awaited<
  ReturnType<typeof getPieces>
>["pieces"][number]
