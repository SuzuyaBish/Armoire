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
import { UpdatePieceParams } from "@/lib/db/schema/pieces"
import { eq } from "drizzle-orm"
import { updatePiece } from "../pieces/mutations"
import { getCollectionWithPieces } from "./queries"

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
    const collectionPieces = await getCollectionWithPieces(collectionId)

    if (collectionPieces.piecesData) {
      for (const piece of collectionPieces.piecesData) {
        const collections = JSON.parse(piece.collections)
        const index = collections.indexOf(collectionId)
        if (index > -1) {
          collections.splice(index, 1)
        }
        const newPiece: UpdatePieceParams = {
          id: piece.id,
          archived: piece.archived ?? false,
          collections: JSON.stringify(collections),
          tags: piece.tags,
          filePath: piece.filePath,
          aspect_ratio: piece.aspect_ratio,
          favorited: piece.favorited ?? false,
        }

        await updatePiece(piece.id, newPiece)
      }
    }

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
