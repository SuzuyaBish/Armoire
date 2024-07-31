import { db } from "@/lib/db/index"
import {
  NewPieceParams,
  PieceId,
  UpdatePieceParams,
  insertPieceSchema,
  pieceIdSchema,
  pieces,
  updatePieceSchema,
} from "@/lib/db/schema/pieces"
import { eq } from "drizzle-orm"
import { copyAsync, deleteAsync } from "expo-file-system"
import { NotificationFeedbackType, notificationAsync } from "expo-haptics"

export const createPiece = async (piece: NewPieceParams, oldPath: string) => {
  const newPiece = insertPieceSchema.parse(piece)
  try {
    const [p] = await db.insert(pieces).values(newPiece).returning()

    if (p) {
      await copyAsync({
        from: oldPath,
        to: newPiece.filePath,
      })
    }

    notificationAsync(NotificationFeedbackType.Success)

    return { piece: p }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}

export const updatePiece = async (id: PieceId, piece: UpdatePieceParams) => {
  const { id: pieceId } = pieceIdSchema.parse({ id })
  const newPiece = updatePieceSchema.parse(piece)
  try {
    const [p] = await db
      .update(pieces)
      .set({
        ...newPiece,
        updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      })
      .where(eq(pieces.id, pieceId!))
      .returning()
    return { piece: p }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}

export const deletePiece = async (id: PieceId) => {
  const { id: pieceId } = pieceIdSchema.parse({ id })
  try {
    const [p] = await db
      .delete(pieces)
      .where(eq(pieces.id, pieceId!))
      .returning()

    await deleteAsync(p.filePath)

    return { piece: p }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}
