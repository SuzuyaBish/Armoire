import { ParentView, Text } from "@/components/StyledComponents"
import { Switch } from "@/components/ui/switch"
import { getPieceById } from "@/lib/api/pieces/queries"
import { ViewerPageProps } from "@/lib/types/viewer-page"
import { format } from "date-fns"
import { Image } from "expo-image"
import { useLocalSearchParams } from "expo-router"
import { ChevronRightIcon } from "lucide-react-native"
import React, { useState } from "react"
import { Pressable, ScrollView, TextInput, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useSWR from "swr"

export default function EditorScreen() {
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams() as ViewerPageProps
  const fetcher = async () => await getPieceById(id)
  const { data } = useSWR(id, fetcher)

  const [piece, setPiece] = useState(data!.piece)

  return (
    <ParentView
      className="pt-6"
      style={{
        paddingBottom: insets.bottom,
      }}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {piece && (
          <View className="gap-y-7">
            <View className="flex items-center">
              <Image
                source={{ uri: piece.filePath }}
                contentFit="cover"
                contentPosition="center"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                }}
              />
            </View>
            <View className="gap-y-3 px-4">
              <Text className="text-cosmosMutedText">Image Title</Text>
              <TextInput
                placeholder="Title"
                className="rounded-full border border-cosmosMutedText/10 bg-cosmosMuted p-5 text-white placeholder:text-cosmosMutedText"
                value={piece!.title!}
                selectTextOnFocus
                onChange={(e) =>
                  setPiece({ ...piece, title: e.nativeEvent.text })
                }
                style={{
                  fontFamily: "favoritRegular",
                  fontSize: 16,
                }}
              />
            </View>
            <View className="gap-y-3 px-4">
              <Text className="text-cosmosMutedText">Image Age</Text>
              <Pressable className="rounded-full border border-cosmosMutedText/10 bg-cosmosMuted p-5 text-white placeholder:text-cosmosMutedText">
                <Text>{format(piece.age!, "dd MMMM yyyy")}</Text>
              </Pressable>
            </View>
            <View className="gap-y-3 px-4">
              <Text className="text-cosmosMutedText">Image Tags</Text>
              <TextInput
                placeholder="Title"
                className="rounded-full border border-cosmosMutedText/10 bg-cosmosMuted p-5 text-white placeholder:text-cosmosMutedText"
                style={{
                  fontFamily: "favoritRegular",
                  fontSize: 16,
                }}
              />
            </View>
            <View className="pt-5">
              <View className="flex flex-row items-center justify-between border-y border-cosmosMutedText/10 px-4 py-7">
                <View>
                  <Text className="text-lg">Favorit Photo</Text>
                  <Text className="text-sm text-cosmosMutedText">
                    Mark this photo as one of your favorits
                  </Text>
                </View>
                <Switch
                  value={piece.favorited!}
                  trackColor={{
                    true: "green",
                    false: "#1D1D1D",
                  }}
                  onChange={(e) => {
                    setPiece({ ...piece, favorited: e.nativeEvent.value })
                  }}
                />
              </View>
              <View className="flex flex-row items-center justify-between border-b border-cosmosMutedText/10 px-4 py-7">
                <View>
                  <Text className="text-lg">Archive Photo</Text>
                  <Text className="text-sm text-cosmosMutedText">
                    Mark this photo as archived
                  </Text>
                </View>
                <Switch
                  value={piece.archived!}
                  trackColor={{
                    true: "green",
                    false: "#1D1D1D",
                  }}
                  onChange={(e) => {
                    setPiece({ ...piece, archived: e.nativeEvent.value })
                  }}
                />
              </View>
              <View className="flex flex-row items-center justify-between px-4 py-7">
                <View>
                  <Text className="text-lg">Delete Photo</Text>
                  <Text className="text-sm text-cosmosMutedText">
                    This action cannot be undone
                  </Text>
                </View>
                <ChevronRightIcon size={26} color="white" />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </ParentView>
  )
}
