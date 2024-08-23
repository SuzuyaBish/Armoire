import { db } from "@/lib/db/index"
import {
  NewTagParams,
  TagId,
  UpdateTagParams,
  insertTagSchema,
  tagIdSchema,
  tags,
  updateTagSchema,
} from "@/lib/db/schema/tags"
import { eq } from "drizzle-orm"

export const createTag = async (tag: NewTagParams) => {
  const newTag = insertTagSchema.parse(tag)
  try {
    const [t] = await db.insert(tags).values(newTag).returning()
    return { tag: t }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}

export const updateTag = async (id: TagId, tag: UpdateTagParams) => {
  const { id: tagId } = tagIdSchema.parse({ id })
  const newTag = updateTagSchema.parse(tag)
  try {
    const [t] = await db
      .update(tags)
      .set({
        ...newTag,
        updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      })
      .where(eq(tags.id, tagId!))
      .returning()
    return { tag: t }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}

export const deleteTag = async (id: TagId) => {
  const { id: tagId } = tagIdSchema.parse({ id })
  try {
    const [t] = await db.delete(tags).where(eq(tags.id, tagId!)).returning()
    return { tag: t }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}

export const deleteAllTags = async () => {
  try {
    await db.delete(tags).returning()
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}
