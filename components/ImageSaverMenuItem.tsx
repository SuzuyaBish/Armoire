import { showNewToast } from "@/lib/toast"
import { NotificationFeedbackType, notificationAsync } from "expo-haptics"
import {
  createAlbumAsync,
  createAssetAsync,
  usePermissions,
} from "expo-media-library"
import React from "react"
import MenuItem from "./MenuItem"
import { useToast } from "./ui/toast"

export default function ImageSaverMenuItem({ filePath }: { filePath: string }) {
  const toast = useToast()
  const [permissionResponse, requestPermission] = usePermissions()
  const getPermissions = async () => {
    if (!permissionResponse?.granted) {
      await requestPermission().then((e) => {
        if (e.granted) {
          return true
        }

        return false
      })
    } else {
      return true
    }
  }
  return (
    <MenuItem
      title="Save Photo"
      description="Save this photo to your devices gallery"
      border="bottom"
      onPress={async () => {
        const res = await getPermissions()

        if (res) {
          const asset = await createAssetAsync(filePath)
          await createAlbumAsync("Armoire", asset, false)

          notificationAsync(NotificationFeedbackType.Success)
          showNewToast({ toast: toast, body: "Photo saved successfully!" })
        }
      }}
    />
  )
}
