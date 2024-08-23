import { db } from "@/lib/db/index"
import { pieceIdSchema, pieces, type PieceId } from "@/lib/db/schema/pieces"
import { desc, eq, ne } from "drizzle-orm"

export const getPieces = async () => {
  const rows = await db.select().from(pieces)
  return { pieces: rows }
}

export const getOrderedPieces = async () => {
  const rows = await db
    .select()
    .from(pieces)
    .where(ne(pieces.archived, true))
    .orderBy(desc(pieces.createdAt))

  return { pieces: rows }
}

export const getOrderedPiecesWithoutArchived = async () => {
  const rows = await db
    .select()
    .from(pieces)
    .where(ne(pieces.archived, true))
    .orderBy(desc(pieces.createdAt))

  return { pieces: rows }
}

export const getOrderedArchived = async () => {
  const rows = await db
    .select()
    .from(pieces)
    .where(eq(pieces.archived, true))
    .orderBy(desc(pieces.createdAt))

  return { pieces: rows }
}

export const getPieceById = async (id: PieceId) => {
  const { id: pieceId } = pieceIdSchema.parse({ id })
  const [row] = await db.select().from(pieces).where(eq(pieces.id, pieceId))
  if (row === undefined) return {}
  return { piece: row }
}

export const getPiecesWithoutId = async (id: string) => {
  const rows = await db.select().from(pieces).where(ne(pieces.id, id))
  return { pieces: rows }
}

export const getOrderedPiecesWithoutId = async (id: string) => {
  const rows = await db
    .select()
    .from(pieces)
    .where(ne(pieces.id, id))
    .orderBy(desc(pieces.createdAt))
  return { pieces: rows }
}

export const getOrderedFavoritePieces = async () => {
  const rows = await db
    .select()
    .from(pieces)
    .where(eq(pieces.favorited, true))
    .orderBy(desc(pieces.createdAt))
  return { pieces: rows }
}

export const getFirst3OrderedPieces = async () => {
  const rows = await db
    .select()
    .from(pieces)
    .orderBy(desc(pieces.createdAt))
    .limit(3)
  return { pieces: rows }
}
