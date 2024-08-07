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
import { Pressable } from "react-native"
import { Text } from "./StyledComponents"
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
    <Pressable
      className="flex flex-row items-center justify-between rounded-2xl bg-muted px-7 py-4"
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
    >
      <Text className="text-lg">Save to Gallery</Text>
      <SaveIcon color="#D0D0D0" size={20} />
    </Pressable>
  )
}

export default ImageSaver
