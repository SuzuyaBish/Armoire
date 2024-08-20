import AppBar from "@/components/AppBar"
import { ParentView, Text } from "@/components/StyledComponents"
import { defaultTags } from "@/constants/default_tags"
import { windowHeight } from "@/constants/window"
import { getPieceById } from "@/lib/api/pieces/queries"
import { getTags } from "@/lib/api/tags/queries"
import { Tag } from "@/lib/db/schema/tags"
import { cn } from "@/lib/utils"
import Color from "color"
import { useLocalSearchParams } from "expo-router"
import { CheckIcon } from "lucide-react-native"
import { AnimatePresence, MotiView } from "moti"
import React from "react"
import { Pressable, ScrollView, TouchableOpacity, View } from "react-native"
import PagerView from "react-native-pager-view"
import { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useSWR from "swr"

type TagsScreenProps = {
  id: string
}

export default function TagsScreen() {
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams() as TagsScreenProps
  const pagerRef = React.useRef<PagerView>(null)

  const fetcher = async () => {
    const { piece } = await getPieceById(params.id)
    const { tags } = await getTags()

    if (piece) {
      setPieceTags(JSON.parse(piece.tags!))
    }

    if (tags) {
      setUserTags(tags)
    }

    return piece
  }
  const { data } = useSWR(`edit-tags-${params.id}`, fetcher)

  const [selectedPage, setSelectedPage] = React.useState(0)

  const [pieceTags, setPieceTags] = React.useState<string[]>([])
  const [userTags, setUserTags] = React.useState<Tag[]>([])

  const green = "#7FA45A"
  const fadedGreen = Color(green).alpha(0.1).toString()
  const muted = "#333"

  return (
    <ParentView hasInsets>
      <AppBar
        custom={false}
        title="Edit Tags"
        hasBackButton
        // action={<>{data?.piece?.tags !== piece?.tags && <Text>Done</Text>}</>}
      />
      <View>
        {pieceTags.length > 0 ? (
          <View
            style={{
              height: windowHeight * 0.4 - insets.top - 40 - insets.bottom,
            }}
          >
            <ScrollView>
              <MotiView
                className="flex flex-row flex-wrap gap-2 overflow-hidden px-4"
                style={{
                  marginBottom: insets.bottom,
                }}
              >
                {pieceTags.map((item) => {
                  return (
                    <MotiView
                      key={item}
                      layout={LinearTransition}
                      from={{ opacity: 0, scale: 0.9 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        backgroundColor: JSON.parse(piece.tags!).includes(item)
                          ? fadedGreen
                          : "transparent",
                        borderColor: JSON.parse(piece.tags!).includes(item)
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
                                tags.filter((tag: string) => tag !== item)
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
                          <MotiView
                            entering={FadeIn.duration(350)}
                            exiting={FadeOut}
                            className="ml-2 flex size-5 items-center justify-center rounded-full"
                            style={{ backgroundColor: green }}
                          >
                            <CheckIcon size={14} color="black" />
                          </MotiView>
                        </AnimatePresence>
                      </Pressable>
                    </MotiView>
                  )
                })}
              </MotiView>
            </ScrollView>
          </View>
        ) : (
          <View
            className="flex items-center justify-center"
            style={{
              height: windowHeight * 0.4 - insets.top - 40 - insets.bottom,
            }}
          >
            <Text className="text-3xl" family="fancy">
              Nothing Archived
            </Text>
            <Text className="mt-3">You can add to your archive by holding</Text>
            <Text>down on an image and selecting archive image.</Text>
          </View>
        )}
        <View
          style={{
            height: windowHeight * 0.6 - insets.bottom,
          }}
        >
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            exitTransition={{
              type: "timing",
              duration: 2500,
            }}
            className="mb-5 mt-3 flex flex-row items-center justify-center border-y border-muted py-2"
          >
            <TouchableOpacity
              onPress={() => pagerRef.current?.setPage(0)}
              className={cn(
                "rounded-full px-6 py-3",
                selectedPage === 0 && "bg-muted"
              )}
            >
              <Text
                className={cn(
                  selectedPage === 0 ? "text-white" : "text-cosmosMutedText"
                )}
              >
                Default Tags
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => pagerRef.current?.setPage(1)}
              className={cn(
                "rounded-full px-6 py-3",
                selectedPage === 1 && "bg-muted"
              )}
            >
              <Text
                className={cn(
                  selectedPage === 1 ? "text-white" : "text-cosmosMutedText"
                )}
              >
                Your Tags
              </Text>
            </TouchableOpacity>
          </MotiView>
          <PagerView
            style={{ flex: 1 }}
            ref={pagerRef}
            initialPage={selectedPage}
            onPageSelected={(e) => setSelectedPage(e.nativeEvent.position)}
          >
            <View key="1" className="flex-1">
              <ScrollView>
                <MotiView
                  className="flex flex-row flex-wrap gap-2 overflow-hidden px-4"
                  style={{
                    marginBottom: insets.bottom,
                  }}
                >
                  {defaultTags.map((item) => {
                    return (
                      <MotiView
                        key={item}
                        layout={LinearTransition}
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          borderColor: muted,
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
                                  tags.filter((tag: string) => tag !== item)
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
                        </Pressable>
                      </MotiView>
                    )
                  })}
                </MotiView>
              </ScrollView>
            </View>
            <View key="2" className="flex-1">
              <ScrollView>
                <MotiView
                  className="flex flex-row flex-wrap gap-2 overflow-hidden px-4"
                  style={{
                    marginBottom: insets.bottom,
                  }}
                >
                  {userTags.map((item) => {
                    return (
                      <MotiView
                        key={item.id}
                        layout={LinearTransition}
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          borderColor: muted,
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
                                  tags.filter((tag: string) => tag !== item)
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
                            <Text className="text-xs">{item.title}</Text>
                          </View>
                        </Pressable>
                      </MotiView>
                    )
                  })}
                </MotiView>
              </ScrollView>
            </View>
          </PagerView>
        </View>
      </View>
    </ParentView>
  )
}
