import { windowWidth } from "@/constants/window"
import { createPiecesPath } from "@/lib/api/pieces/functions"
import { createPiece } from "@/lib/api/pieces/mutations"
import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker"
import React from "react"
import { Image as DefaultImage, Pressable } from "react-native"
import { useSWRConfig } from "swr"
import { Text } from "./StyledComponents"

export default function ImagePicker() {
  const { mutate } = useSWRConfig()

  const pickMedia = async () => {
    let result = await launchImageLibraryAsync({
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
                age: new Date(),
                tags: JSON.stringify([]),
                title: fileDetails.uri.split("/").pop()!,
                archived: false,
                collectionId: "",
              },
              fileDetails.uri
            )

            mutate("pieces")
          }
        )
      }
    }
  }
  return (
    <Pressable
      onPress={() => {
        pickMedia()
      }}
      className="flex h-full items-center justify-center"
      style={{ width: windowWidth / 3 - 10 }}
    >
      <Text>Image</Text>
    </Pressable>
  )
}
