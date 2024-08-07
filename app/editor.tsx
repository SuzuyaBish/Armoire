import { ParentView, Text } from "@/components/StyledComponents"
import { Switch } from "@/components/ui/switch"
import { defaultTags } from "@/constants/default_tags"
import { getPieceById } from "@/lib/api/pieces/queries"
import { ViewerPageProps } from "@/lib/types/viewer-page"
import { cn } from "@/lib/utils"
import { AnimatePresence } from "@legendapp/motion"
import Color from "color"
import { Image } from "expo-image"
import { useLocalSearchParams } from "expo-router"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "lucide-react-native"
import { MotiView } from "moti/build"
import React, { useState } from "react"
import { Pressable, ScrollView, View } from "react-native"
import { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useSWR from "swr"

export default function EditorScreen() {
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams() as ViewerPageProps
  const fetcher = async () => await getPieceById(id)
  const { data } = useSWR(id, fetcher)

  const [piece, setPiece] = useState(data!.piece)
  const [tagsExpanded, setTagsExpanded] = useState(false)

  const green = "#7FA45A"
  const fadedGreen = Color(green).alpha(0.1).toString()
  const muted = "#333"

  return (
    <ParentView
      className="pt-6"
      style={{
        paddingBottom: insets.bottom,
      }}
    >
      <View className="flex-1">
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
            <View className="">
              <View className="flex flex-col overflow-hidden">
                <Pressable
                  onPress={() => setTagsExpanded(!tagsExpanded)}
                  className={cn(
                    "flex flex-row items-center justify-between border-cosmosMutedText/10 px-4 py-7",
                    tagsExpanded ? "border-y" : "border-t"
                  )}
                >
                  <View>
                    <Text className="text-lg">Edit Tags</Text>

                    <Text className="text-sm text-cosmosMutedText">
                      Add or remove tags from this photo
                    </Text>
                  </View>
                  <MotiView
                    animate={{
                      transform: [
                        {
                          rotate: tagsExpanded ? "180deg" : "0deg",
                        },
                      ],
                    }}
                    transition={{ duration: 150, type: "timing" }}
                  >
                    <ChevronDownIcon size={26} color="white" />
                  </MotiView>
                </Pressable>

                <MotiView
                  animate={{
                    maxHeight: tagsExpanded ? 400 : 0,
                    height: "auto",
                    overflow: "hidden",
                  }}
                  transition={{
                    type: "timing",
                    duration: 150,
                  }}
                >
                  <AnimatePresence>
                    <ScrollView>
                      {tagsExpanded && (
                        <MotiView className="my-5 flex flex-row flex-wrap gap-2 overflow-hidden px-4">
                          {defaultTags.map((item) => {
                            return (
                              <MotiView
                                key={item}
                                layout={LinearTransition}
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{
                                  opacity: 1,
                                  scale: 1,
                                  backgroundColor: JSON.parse(
                                    piece.tags!
                                  ).includes(item)
                                    ? fadedGreen
                                    : "transparent",
                                  borderColor: JSON.parse(piece.tags!).includes(
                                    item
                                  )
                                    ? green
                                    : muted,
                                }}
                                className="mb-3 flex flex-row items-center rounded-full border"
                              >
                                <Pressable
                                  className="flex flex-row items-center px-3 py-2"
                                  onPress={() => {
                                    const tags = JSON.parse(piece.tags!)

                                    if (tags.includes(item)) {
                                      setPiece({
                                        ...piece,
                                        tags: JSON.stringify(
                                          tags.filter(
                                            (tag: string) => tag !== item
                                          )
                                        ),
                                      })
                                    } else {
                                      setPiece({
                                        ...piece,
                                        tags: JSON.stringify([...tags, item]),
                                      })
                                    }
                                  }}
                                >
                                  <View className="flex h-5 items-center justify-center">
                                    <Text className="text-xs">{item}</Text>
                                  </View>

                                  <AnimatePresence>
                                    {JSON.parse(piece.tags!).includes(item) && (
                                      <MotiView
                                        entering={FadeIn.duration(350)}
                                        exiting={FadeOut}
                                        className="ml-2 flex size-5 items-center justify-center rounded-full"
                                        style={{ backgroundColor: green }}
                                      >
                                        <CheckIcon size={14} color="black" />
                                      </MotiView>
                                    )}
                                  </AnimatePresence>
                                </Pressable>
                              </MotiView>
                            )
                          })}
                        </MotiView>
                      )}
                    </ScrollView>
                  </AnimatePresence>
                </MotiView>
              </View>
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
                    true: green,
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
                    true: green,
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
      </View>
    </ParentView>
  )
}
