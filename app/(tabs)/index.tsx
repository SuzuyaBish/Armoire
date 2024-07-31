import Image from "@/components/Image"
import { ParentView, Text } from "@/components/StyledComponents"
import { getFilesWithThumbnail } from "@/lib/api/files/queries"
import { FileWithThumbnail } from "@/lib/db/schema/files"
import { capitalize, cn } from "@/lib/utils"
import MasonryList from "@react-native-seoul/masonry-list"
import { BlurView } from "expo-blur"
import { useRouter } from "expo-router"
import { MotiImage, MotiView } from "moti/build"
import { MotiPressable } from "moti/interactions"
import { useRef, useState } from "react"
import { TouchableOpacity, View } from "react-native"
import PagerView from "react-native-pager-view"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useSWR from "swr"

export default function TabOneScreen() {
  const router = useRouter()
  const [selectedPage, setSelectedPage] = useState(0)
  const pagerRef = useRef<PagerView>(null)
  const insets = useSafeAreaInsets()

  const { data, mutate, isLoading } = useSWR("pieces", getFilesWithThumbnail)
  return (
    <ParentView hasInsets hasPadding className="relative">
      <View className="my-6 flex flex-row items-center justify-center gap-x-7">
        <TouchableOpacity onPress={() => pagerRef.current?.setPage(0)}>
          <Text
            className={cn(
              selectedPage === 0 ? "text-white" : "text-cosmosMutedText"
            )}
          >
            Clothes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pagerRef.current?.setPage(1)}>
          <Text
            className={cn(
              selectedPage === 1 ? "text-white" : "text-cosmosMutedText"
            )}
          >
            Collections
          </Text>
        </TouchableOpacity>
      </View>
      <PagerView
        ref={pagerRef}
        initialPage={selectedPage}
        onPageSelected={(e) => setSelectedPage(e.nativeEvent.position)}
        style={{
          flex: 1,
        }}
      >
        <View className="flex-1 overflow-visible">
          {!isLoading && data && data?.files.length > 0 && (
            <MasonryList
              data={data.files}
              keyExtractor={(item): string => item.id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, i }) => {
                const piece: FileWithThumbnail = item as FileWithThumbnail

                if (piece.fileType === "image") {
                  return (
                    <Image piece={piece} index={i} length={data.files.length} />
                  )
                } else {
                  return (
                    <MotiView
                      from={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: i * 100,
                        type: "timing",
                        duration: 500,
                      }}
                    >
                      <MotiPressable
                        transition={{
                          type: "spring",
                          damping: 20,
                          stiffness: 300,
                        }}
                        animate={({ hovered, pressed }) => {
                          "worklet"

                          return {
                            scale: pressed ? 0.95 : hovered ? 1.05 : 1,
                          }
                        }}
                        onPress={() =>
                          router.push({
                            pathname: "/viewer",
                            params: { id: piece.id },
                          })
                        }
                        style={{
                          padding: 8,
                          width: "100%",
                          position: "relative",
                        }}
                      >
                        {piece.thumbnail ? (
                          <MotiImage
                            source={{ uri: piece.thumbnail }}
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                              height: 200,
                              width: "100%",
                            }}
                          />
                        ) : (
                          <View
                            style={{ height: 200, width: "100%" }}
                            className="bg-cosmosMuted"
                          />
                        )}
                        <BlurView
                          className="absolute rounded-full px-2 py-1"
                          tint="light"
                          style={{
                            bottom: 14,
                            right: 14,
                            overflow: "hidden",
                          }}
                        >
                          <Text className="text-xs">
                            {capitalize(piece.fileType)}
                          </Text>
                        </BlurView>
                      </MotiPressable>
                    </MotiView>
                  )
                }
              }}
              refreshing={isLoading}
              onRefresh={() => mutate()}
            />
          )}
        </View>
        <View key="2">
          <Text>{JSON.stringify(data, null, 2)}</Text>
        </View>
      </PagerView>
    </ParentView>
  )
}
