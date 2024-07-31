import { db } from "@/lib/db/index"
import {
  NewSettingParams,
  SettingId,
  UpdateSettingParams,
  insertSettingSchema,
  settingIdSchema,
  settings,
  updateSettingSchema,
} from "@/lib/db/schema/settings"
import { eq } from "drizzle-orm"

export const createSetting = async (setting: NewSettingParams) => {
  const newSetting = insertSettingSchema.parse(setting)
  try {
    const [s] = await db.insert(settings).values(newSetting).returning()
    return { setting: s }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}

export const updateSetting = async (
  id: SettingId,
  setting: UpdateSettingParams
) => {
  const { id: settingId } = settingIdSchema.parse({ id })
  const newSetting = updateSettingSchema.parse(setting)
  try {
    const [s] = await db
      .update(settings)
      .set({
        ...newSetting,
        updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      })
      .where(eq(settings.id, settingId!))
      .returning()
    return { setting: s }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}

export const deleteSetting = async (id: SettingId) => {
  const { id: settingId } = settingIdSchema.parse({ id })
  try {
    const [s] = await db
      .delete(settings)
      .where(eq(settings.id, settingId!))
      .returning()
    return { setting: s }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}
