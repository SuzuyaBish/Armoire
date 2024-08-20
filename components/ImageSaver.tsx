import { Piece } from "@/lib/db/schema/pieces"
import { showNewToast } from "@/lib/toast"
import { NotificationFeedbackType, notificationAsync } from "expo-haptics"
import {
  createAlbumAsync,
  createAssetAsync,
  usePermissions,
} from "expo-media-library"
import { SaveIcon } from "lucide-react-native"
import { FC } from "react"
import SheetMenuItem from "./SheetMenuItem"
import { useToast } from "./ui/toast"

interface ImageSaverProps extends Piece {
  close: () => void
}

const ImageSaver: FC<ImageSaverProps> = ({ close, ...props }) => {
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
    <SheetMenuItem
      title="Save to Gallery"
      icon={<SaveIcon color="#494849" size={18} />}
      onPress={async () => {
        const res = await getPermissions()

        if (res) {
          const asset = await createAssetAsync(props.filePath)
          await createAlbumAsync("Armoire", asset, false)
        }

        notificationAsync(NotificationFeedbackType.Success)
        showNewToast({ toast: toast, body: "Photo saved successfully!" })

        close()
      }}
    />
  )
}

export default ImageSaver
