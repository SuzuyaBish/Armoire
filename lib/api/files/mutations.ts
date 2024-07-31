import { filesUrl } from "@/constants/files"
import { db } from "@/lib/db/index"
import {
  FileId,
  NewFileParams,
  UpdateFileParams,
  fileIdSchema,
  files,
  insertFileSchema,
  updateFileSchema,
} from "@/lib/db/schema/files"
import { eq } from "drizzle-orm"
import { copyAsync, deleteAsync } from "expo-file-system"
import { NotificationFeedbackType, notificationAsync } from "expo-haptics"
import { deleteFromFilesPath } from "./functions"

export const createFile = async (file: NewFileParams, oldPath: string) => {
  const newFile = insertFileSchema.parse(file)
  try {
    const [f] = await db.insert(files).values(newFile).returning()

    if (f) {
      console.log("Started Copying")
      await copyAsync({
        from: oldPath,
        to: newFile.filePath,
      })

      console.log("Finished Copying")
    }

    notificationAsync(NotificationFeedbackType.Success)

    console.log("File created successfully", f)

    return { file: f }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    notificationAsync(NotificationFeedbackType.Error)
    throw { error: message }
  }
}

export const updateFile = async (id: FileId, file: UpdateFileParams) => {
  const { id: fileId } = fileIdSchema.parse({ id })
  const newFile = updateFileSchema.parse(file)
  try {
    const [f] = await db
      .update(files)
      .set({
        ...newFile,
        updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      })
      .where(eq(files.id, fileId!))
      .returning()
    return { file: f }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}

export const deleteFile = async (id: FileId) => {
  const { id: fileId } = fileIdSchema.parse({ id })
  try {
    const [f] = await db.delete(files).where(eq(files.id, fileId!)).returning()

    await deleteFromFilesPath(f.filePath)

    return { file: f }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}

export const clearFiles = async () => {
  try {
    await db.delete(files).returning()
    await deleteAsync(filesUrl)

    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}
