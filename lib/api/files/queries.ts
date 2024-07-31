import { db } from "@/lib/db/index"
import { collections } from "@/lib/db/schema/collections"
import {
  FileWithThumbnail,
  fileIdSchema,
  files,
  type FileId,
} from "@/lib/db/schema/files"
import { eq, ne } from "drizzle-orm"
import { getThumbnailAsync } from "expo-video-thumbnails"

export const getFiles = async () => {
  const rows = await db
    .select({ file: files, collection: collections })
    .from(files)
    .leftJoin(collections, eq(files.collectionId, collections.id))
  const f = rows.map((r) => ({ ...r.file, collection: r.collection }))
  return { files: f }
}

export const getFileById = async (id: FileId) => {
  const { id: fileId } = fileIdSchema.parse({ id })
  const [row] = await db
    .select({ file: files, collection: collections })
    .from(files)
    .where(eq(files.id, fileId))
    .leftJoin(collections, eq(files.collectionId, collections.id))
  if (row === undefined) return {}
  const f = { ...row.file, collection: row.collection }
  return { file: f }
}

export const getFilesWithThumbnail = async () => {
  const rows = await db
    .select({ file: files, collection: collections })
    .from(files)
    .leftJoin(collections, eq(files.collectionId, collections.id))
  const f = rows.map((r) => ({ ...r.file, collection: r.collection }))

  let newFiles: FileWithThumbnail[] = []

  for (const file of f) {
    if (file.fileType === "video") {
      try {
        console.log(file)
        const { uri } = await getThumbnailAsync(file.filePath)

        newFiles.push({ ...file, thumbnail: uri })
      } catch (error) {
        newFiles.push(file)
      }
    } else {
      newFiles.push(file)
    }
  }

  return { files: newFiles }
}

export const getFileWithThumbnailExcept = async (id: FileId) => {
  const rows = await db
    .select({ file: files, collection: collections })
    .from(files)
    .where(ne(files.id, id))
    .leftJoin(collections, eq(files.collectionId, collections.id))
  const f = rows.map((r) => ({ ...r.file, collection: r.collection }))

  let newFiles: FileWithThumbnail[] = []

  for (const file of f) {
    if (file.fileType === "video") {
      try {
        const { uri } = await getThumbnailAsync(file.filePath)

        newFiles.push({ ...file, thumbnail: uri })
      } catch (error) {
        newFiles.push(file)
      }
    } else {
      newFiles.push(file)
    }
  }

  return { files: newFiles }
}
