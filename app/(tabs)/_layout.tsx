import { Text } from "@/components/StyledComponents"
import { windowWidth } from "@/constants/window"
import { createPiecesPath } from "@/lib/api/pieces/functions"
import { createPiece } from "@/lib/api/pieces/mutations"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics"
import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker"
import { Tabs } from "expo-router"
import { HomeIcon, PlusIcon, SearchIcon } from "lucide-react-native"
import React, { useCallback, useRef } from "react"
import {
  Image as DefaultImage,
  Pressable,
  TouchableOpacity,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSWRConfig } from "swr"

export default function TabLayout() {
  const insets = useSafeAreaInsets()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const { mutate } = useSWRConfig()

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

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
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#AAAAAA",
        tabBarStyle: {
          height: 90,
          backgroundColor: "#0E0E0E",
          borderTopColor: "#333",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tab One",
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarButton: ({ style }) => (
            <TouchableOpacity
              onPress={() => {
                impactAsync(ImpactFeedbackStyle.Soft)
                handlePresentModalPress()
              }}
              style={[
                style,
                { alignItems: "center", justifyContent: "center" },
              ]}
            >
              <PlusIcon size={30} color="#AAAAAA" />
              <BottomSheetModal
                ref={bottomSheetModalRef}
                detached
                snapPoints={[64]}
                bottomInset={insets.bottom + 10}
                style={{
                  marginHorizontal: 10,
                  borderRadius: 16,
                  overflow: "hidden",
                  backgroundColor: "#1D1D1D",
                }}
                keyboardBehavior="interactive"
                backgroundStyle={{
                  backgroundColor: "#1D1D1D",
                }}
                backdropComponent={(e) => {
                  return (
                    <BottomSheetBackdrop
                      onPress={() => bottomSheetModalRef.current?.dismiss()}
                      appearsOnIndex={0}
                      disappearsOnIndex={-1}
                      style={[e.style, { backgroundColor: "rgba(0,0,0,0.6)" }]}
                      animatedIndex={e.animatedIndex}
                      animatedPosition={e.animatedPosition}
                    />
                  )
                }}
                handleComponent={null}
              >
                <BottomSheetView
                  className="flex w-full flex-row items-center bg-cosmosMuted"
                  style={{ height: 64 }}
                >
                  <Pressable
                    onPress={() => {
                      pickMedia()
                    }}
                    className="flex h-full items-center justify-center"
                    style={{ width: windowWidth / 3 - 10 }}
                  >
                    <Text>Media</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {}}
                    style={{ width: windowWidth / 3 - 10 }}
                    className="flex h-full items-center justify-center border-x"
                  >
                    <Text>File</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {}}
                    style={{ width: windowWidth / 3 - 10 }}
                    className="flex h-full items-center justify-center"
                  >
                    <Text>Collection</Text>
                  </Pressable>
                </BottomSheetView>
              </BottomSheetModal>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => <SearchIcon color={color} />,
        }}
      />
    </Tabs>
  )
}
