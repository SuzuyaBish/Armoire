import { Text } from "@/components/StyledComponents"
import { windowHeight, windowWidth } from "@/constants/window"
import { createPiecesPath } from "@/lib/api/pieces/functions"
import { createPiece } from "@/lib/api/pieces/mutations"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { BlurView } from "expo-blur"
import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera"
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics"
import { Image } from "expo-image"
import { RefreshCw, XIcon } from "lucide-react-native"
import { MotiPressable } from "moti/interactions"
import React, { useRef, useState } from "react"
import { Pressable, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSWRConfig } from "swr"

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["

export default function PhotoTaker() {
  const insets = useSafeAreaInsets()
  const { mutate } = useSWRConfig()
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const cameraRef = useRef<CameraView>(null)

  const [permission, requestPermission] = useCameraPermissions()
  const [facing, setFacing] = useState<CameraType>("back")
  const [image, setImage] = useState<CameraCapturedPicture | undefined>(
    undefined
  )

  const getPermissions = async () => {
    if (!permission) return

    if (permission.granted) {
      bottomSheetRef.current?.present()
      return permission.granted
    } else {
      await requestPermission().then((e) => {
        if (e.granted) {
          bottomSheetRef.current?.present()
          return permission.granted
        } else {
          return false
        }
      })
    }
  }

  return (
    <Pressable
      onPress={async () => getPermissions()}
      style={{ width: windowWidth / 3 - 10 }}
      className="flex h-full items-center justify-center border-x"
    >
      <Text>Photo</Text>
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={["100%"]}
        detached
        bottomInset={insets.bottom}
        topInset={insets.top}
        style={{ marginHorizontal: 10, overflow: "hidden", borderRadius: 24 }}
        handleComponent={null}
      >
        <BottomSheetView style={{ flex: 1 }} className="bg-bgColor">
          {image ? (
            <View
              className="relative"
              style={{
                height: windowHeight - insets.top - insets.bottom,
                width: windowWidth - 10,
              }}
            >
              <View className="absolute right-0 top-0 z-10 flex w-full flex-row items-center justify-end px-8 py-5">
                <BlurView className="overflow-hidden rounded-full">
                  <TouchableOpacity
                    className="p-3"
                    onPress={() => {
                      setImage(undefined)
                      bottomSheetRef.current?.dismiss()
                    }}
                  >
                    <XIcon color="white" />
                  </TouchableOpacity>
                </BlurView>
              </View>
              <Image
                source={{ uri: image.uri }}
                placeholder={blurhash}
                contentFit="cover"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
              <View className="absolute bottom-10 left-0 right-0">
                <View className="flex flex-row items-center justify-evenly px-5">
                  <TouchableOpacity
                    className="rounded-xl bg-destructive px-8 py-4"
                    onPress={() => {
                      impactAsync(ImpactFeedbackStyle.Heavy)
                      setImage(undefined)
                    }}
                  >
                    <Text className="text-lg text-destructiveText">
                      Retake Photo
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="rounded-xl bg-bgColor px-8 py-4"
                    onPress={async () => {
                      const path = await createPiecesPath()
                      await createPiece(
                        {
                          archived: false,
                          tags: JSON.stringify([]),
                          filePath: path.uri + image.uri.split("/").pop(),
                          aspect_ratio: image.width / image.height,
                          collections: JSON.stringify([]),
                          favorited: false,
                        },
                        image.uri
                      )
                      mutate("pieces")
                      impactAsync(ImpactFeedbackStyle.Medium)
                      setImage(undefined)
                      bottomSheetRef.current?.dismiss()
                    }}
                  >
                    <Text className="text-lg">Save Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
              <View className="flex flex-1 flex-col p-5">
                <View className="flex flex-row items-center justify-end">
                  <BlurView className="overflow-hidden rounded-full">
                    <TouchableOpacity
                      className="p-3"
                      onPress={() => {
                        setImage(undefined)
                        bottomSheetRef.current?.dismiss()
                      }}
                    >
                      <XIcon color="white" />
                    </TouchableOpacity>
                  </BlurView>
                </View>
                <View className="mt-auto flex flex-row items-end justify-center">
                  <View className="flex flex-row items-center gap-x-7">
                    <TouchableOpacity className="p-3">
                      <RefreshCw color="transparent" />
                    </TouchableOpacity>
                    <MotiPressable
                      onPress={async () => {
                        const image =
                          await cameraRef.current?.takePictureAsync()
                        setImage(image)
                      }}
                      animate={({ hovered, pressed }) => {
                        "worklet"

                        return {
                          scale: hovered || pressed ? 0.9 : 1,
                        }
                      }}
                      style={{
                        backgroundColor: "white",
                        width: 70,
                        height: 70,
                        borderRadius: 70,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    />
                    <BlurView className="overflow-hidden rounded-full">
                      <TouchableOpacity
                        className="p-3"
                        onPress={() => {
                          setFacing(facing === "back" ? "front" : "back")
                        }}
                      >
                        <RefreshCw color="white" />
                      </TouchableOpacity>
                    </BlurView>
                  </View>
                </View>
              </View>
            </CameraView>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </Pressable>
  )
}
