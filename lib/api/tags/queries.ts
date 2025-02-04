import { db } from "@/lib/db/index"
import { tagIdSchema, tags, type TagId } from "@/lib/db/schema/tags"
import { eq } from "drizzle-orm"

export const getTags = async () => {
  const rows = await db.select().from(tags)
  const t = rows
  return { tags: t }
}

export const getTagById = async (id: TagId) => {
  const { id: tagId } = tagIdSchema.parse({ id })
  const [row] = await db.select().from(tags).where(eq(tags.id, tagId))
  if (row === undefined) return {}
  const t = row
  return { tag: t }
}
