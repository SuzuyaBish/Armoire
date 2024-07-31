import { db } from "@/lib/db/index"
import {
  settingIdSchema,
  settings,
  type SettingId,
} from "@/lib/db/schema/settings"
import { eq } from "drizzle-orm"

export const getSettings = async () => {
  const rows = await db.select().from(settings)
  const s = rows
  return { settings: s }
}

export const getSettingById = async (id: SettingId) => {
  const { id: settingId } = settingIdSchema.parse({ id })
  const [row] = await db
    .select()
    .from(settings)
    .where(eq(settings.id, settingId))
  if (row === undefined) return {}
  const s = row
  return { setting: s }
}
