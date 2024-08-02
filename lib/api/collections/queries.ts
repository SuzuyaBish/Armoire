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
  const piecesData = await db
    .select()
    .from(pieces)
    .where(eq(pieces.collectionId, collectionId))
  return { collection: c, piecesData }
}

export const getAllCollectionsWithFirstPiece = async () => {
  const collectionsData = await db.select().from(collections)
  const allData = await Promise.all(
    collectionsData.map(async (collection) => {
      const piecesData = await db
        .select()
        .from(pieces)
        .where(eq(pieces.collectionId, collection.id))
      return { ...collection, piecesData }
    })
  )
  return { allData }
}
