import { db } from "@/lib/db/index"
import {
  CollectionId,
  NewCollectionParams,
  UpdateCollectionParams,
  collectionIdSchema,
  collections,
  insertCollectionSchema,
  updateCollectionSchema,
} from "@/lib/db/schema/collections"
import { eq } from "drizzle-orm"

export const createCollection = async (collection: NewCollectionParams) => {
  const newCollection = insertCollectionSchema.parse(collection)
  try {
    const [c] = await db.insert(collections).values(newCollection).returning()
    return { collection: c }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}

export const updateCollection = async (
  id: CollectionId,
  collection: UpdateCollectionParams
) => {
  const { id: collectionId } = collectionIdSchema.parse({ id })
  const newCollection = updateCollectionSchema.parse(collection)
  try {
    const [c] = await db
      .update(collections)
      .set({
        ...newCollection,
        updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      })
      .where(eq(collections.id, collectionId!))
      .returning()
    return { collection: c }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}

export const deleteCollection = async (id: CollectionId) => {
  const { id: collectionId } = collectionIdSchema.parse({ id })
  try {
    const [c] = await db
      .delete(collections)
      .where(eq(collections.id, collectionId!))
      .returning()
    return { collection: c }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}
