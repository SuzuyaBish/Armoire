import { db } from "@/lib/db/index"
import {
  collectionIdSchema,
  collections,
  type CollectionId,
} from "@/lib/db/schema/collections"
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
