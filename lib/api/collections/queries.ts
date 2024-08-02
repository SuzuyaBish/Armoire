import { db } from "@/lib/db/index"
import {
  collectionIdSchema,
  collections,
  type CollectionId,
} from "@/lib/db/schema/collections"
import { pieces } from "@/lib/db/schema/pieces"
import { eq } from "drizzle-orm"

export const getCollections = async () => {
  const rows = await db.select().from(collections)
  const c = rows
  return { collections: c }
}

export const getCollectionById = async (id: CollectionId) => {
  const { id: collectionId } = collectionIdSchema.parse({ id })
  const [row] = await db
    .select()
    .from(collections)
    .where(eq(collections.id, collectionId))
  if (row === undefined) return {}
  const c = row
  return { collection: c }
}

export const getCollectionWithPieces = async (id: CollectionId) => {
  const { id: collectionId } = collectionIdSchema.parse({ id })
  const [row] = await db
    .select()
    .from(collections)
    .where(eq(collections.id, collectionId))
  if (row === undefined) return {}
  const c = row

  const piecesData = await db.select().from(pieces)

  const piecesDataFiltered = piecesData.filter((piece) => {
    const collections = JSON.parse(piece.collections)
    return collections.includes(collectionId)
  })

  return { collection: c, piecesData: piecesDataFiltered }
}

export const getAllCollectionsWithFirstPiece = async () => {
  const collectionsData = await db.select().from(collections)

  const piecesData = await db.select().from(pieces)
  const allData = collectionsData.map((collection) => {
    const piecesDataFiltered = piecesData.filter((piece) => {
      const collections = JSON.parse(piece.collections)
      return collections.includes(collection.id)
    })
    return { ...collection, piecesData: piecesDataFiltered }
  })

  return { allData }
}
