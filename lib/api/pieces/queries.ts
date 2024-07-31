import { db } from "@/lib/db/index"
import { collections } from "@/lib/db/schema/collections"
import { pieceIdSchema, pieces, type PieceId } from "@/lib/db/schema/pieces"
import { desc, eq, ne } from "drizzle-orm"

export const getPieces = async () => {
  const rows = await db
    .select({ piece: pieces, collection: collections })
    .from(pieces)
    .leftJoin(collections, eq(pieces.collectionId, collections.id))
  const p = rows.map((r) => ({ ...r.piece, collection: r.collection }))
  return { pieces: p }
}

export const getOrderedPieces = async () => {
  const rows = await db
    .select({ piece: pieces, collection: collections })
    .from(pieces)
    .leftJoin(collections, eq(pieces.collectionId, collections.id))
    .orderBy(desc(pieces.createdAt))

  const p = rows.map((r) => ({ ...r.piece, collection: r.collection }))
  return { pieces: p }
}

export const getPieceById = async (id: PieceId) => {
  const { id: pieceId } = pieceIdSchema.parse({ id })
  const [row] = await db
    .select({ piece: pieces, collection: collections })
    .from(pieces)
    .where(eq(pieces.id, pieceId))
    .leftJoin(collections, eq(pieces.collectionId, collections.id))
  if (row === undefined) return {}
  const p = { ...row.piece, collection: row.collection }
  return { piece: p }
}

export const getPiecesWithoutId = async (id: string) => {
  const rows = await db
    .select({ piece: pieces, collection: collections })
    .from(pieces)
    .leftJoin(collections, eq(pieces.collectionId, collections.id))
    .where(ne(pieces.id, id))
  const p = rows.map((r) => ({ ...r.piece, collection: r.collection }))
  return { pieces: p }
}

export const getOrderedPiecesWithoutId = async (id: string) => {
  const rows = await db
    .select({ piece: pieces, collection: collections })
    .from(pieces)
    .leftJoin(collections, eq(pieces.collectionId, collections.id))
    .where(ne(pieces.id, id))
    .orderBy(desc(pieces.createdAt))
  const p = rows.map((r) => ({ ...r.piece, collection: r.collection }))
  return { pieces: p }
}
