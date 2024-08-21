import { NotificationFeedbackType, notificationAsync } from "expo-haptics"
import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker"
import { Image as DefaultImage } from "react-native"
import { mutate } from "swr"
import { createPiecesPath } from "./functions"
import { createPiece } from "./mutations"

export const pickMedia = async () => {
  const result = await launchImageLibraryAsync({
    mediaTypes: MediaTypeOptions.Images,
    quality: 1,
    allowsMultipleSelection: true,
  })

  if (!result.canceled) {
    const path = await createPiecesPath()

    for (let i = 0; i < result.assets.length; i++) {
      const fileDetails = result.assets[i]

      await DefaultImage.getSize(
        result.assets[i].uri,
        async (width, height) => {
          const aspectRatio = width / height

          await createPiece(
            {
              filePath: path.uri + fileDetails.uri.split("/").pop(),
              aspect_ratio: aspectRatio,
              tags: JSON.stringify([]),
              archived: false,
              collections: JSON.stringify([]),
              favorited: false,
            },
            fileDetails.uri
          )

          mutate("pieces")
        }
      )
    }

    notificationAsync(NotificationFeedbackType.Success)
    return true
  }

  return false
}
