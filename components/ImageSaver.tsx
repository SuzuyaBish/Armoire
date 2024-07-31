import { Piece } from "@/lib/db/schema/pieces"
import {
  createAlbumAsync,
  createAssetAsync,
  usePermissions,
} from "expo-media-library"
import { SaveIcon } from "lucide-react-native"
import { FC } from "react"
import { Pressable } from "react-native"
import { Text } from "./StyledComponents"

interface ImageSaverProps extends Piece {
  close: () => void
}

const ImageSaver: FC<ImageSaverProps> = ({ close, ...props }) => {
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
      className="flex flex-row items-center justify-between rounded-b-2xl border-t border-cosmosMutedText/10 bg-muted px-7 py-4"
      onPress={async () => {
        const res = await getPermissions()

        if (res) {
          const asset = await createAssetAsync(props.filePath)
          await createAlbumAsync("Armoire", asset, false)
        }

        close()
      }}
    >
      <Text className="text-lg">Save Element</Text>
      <SaveIcon color="#D0D0D0" />
    </Pressable>
  )
}

export default ImageSaver
