import AnimatedPressable from "@/components/AnimatedPressable"
import ArchiveScreen from "@/components/ArchiveScreen"
import Image from "@/components/Image"
import SelectionBar from "@/components/SelectionBar"
import { ParentView, Text } from "@/components/StyledComponents"
import { getOrderedPiecesWithoutArchived } from "@/lib/api/pieces/queries"
import { Piece } from "@/lib/db/schema/pieces"
import { useFabStore } from "@/lib/store/fab-store"
import { useHomeStore } from "@/lib/store/home-store"
import { cn } from "@/lib/utils"
import MasonryList from "@react-native-seoul/masonry-list"
import { MotiView } from "moti/build"
import { useRef, useState } from "react"
import { Pressable, ScrollView, View } from "react-native"
import PagerView from "react-native-pager-view"
import Animated, { LinearTransition } from "react-native-reanimated"
import useSWR from "swr"

export default function TabOneScreen() {
  const fabStore = useFabStore()

  const [selectedPage, setSelectedPage] = useState(0)
  const pagerRef = useRef<PagerView>(null)
  const homeStore = useHomeStore()

  const { data, mutate, isLoading } = useSWR(
    "pieces",
    getOrderedPiecesWithoutArchived
  )
  return (
    <ParentView hasInsets hasPadding className="relative">
      <SelectionBar />
      {fabStore.stage === "2" && (
        <Pressable
          className="absolute bottom-0 left-0 right-0 top-0 z-10"
          onPress={() => fabStore.setStage("1")}
        />
      )}
      {homeStore.isSelecting ? (
        <Animated.View
          layout={LinearTransition.springify()
            .stiffness(1000)
            .damping(500)
            .mass(3)}
          className="my-6 flex items-center justify-center"
        >
          <Text>Selecting</Text>
        </Animated.View>
      ) : (
        <Animated.View
          layout={LinearTransition.springify()
            .stiffness(1000)
            .damping(500)
            .mass(3)}
          className="my-3 flex flex-row items-center justify-center"
        >
          <AnimatedPressable
            onPress={() => pagerRef.current?.setPage(0)}
            extraModest
          >
            <View
              className={cn(
                "rounded-full px-6 py-3",
                selectedPage === 0 && "bg-accent"
              )}
            >
              <Text
                family="lfeMedium"
                className={cn(
                  selectedPage === 0 ? "text-white" : "text-mutedForeground"
                )}
              >
                Clothes
              </Text>
            </View>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => pagerRef.current?.setPage(1)}
            extraModest
          >
            <View
              className={cn(
                "rounded-full px-6 py-3",
                selectedPage === 1 && "bg-accent"
              )}
            >
              <Text
                family="lfeMedium"
                className={cn(
                  selectedPage === 1 ? "text-white" : "text-mutedForeground"
                )}
              >
                Favorites
              </Text>
            </View>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => pagerRef.current?.setPage(2)}
            extraModest
          >
            <View
              className={cn(
                "rounded-full px-6 py-3",
                selectedPage === 2 && "bg-accent"
              )}
            >
              <Text
                family="lfeMedium"
                className={cn(
                  selectedPage === 2 ? "text-white" : "text-mutedForeground"
                )}
              >
                Archive
              </Text>
            </View>
          </AnimatedPressable>
        </Animated.View>
      )}
      <PagerView
        ref={pagerRef}
        initialPage={selectedPage}
        onPageSelected={(e) => setSelectedPage(e.nativeEvent.position)}
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 overflow-visible"
          key="1"
        >
          {!isLoading && data && data?.pieces.length > 0 && (
            <Animated.View className="flex flex-row flex-wrap justify-between">
              {data.pieces.map((piece, i) => {
                return (
                  <MotiView
                    key={piece.id}
                    layout={LinearTransition.springify()
                      .stiffness(1000)
                      .damping(500)
                      .mass(3)}
                  >
                    <Image
                      piece={piece}
                      index={i}
                      length={data.pieces.length}
                    />
                  </MotiView>
                )
              })}
            </Animated.View>
          )}
        </ScrollView>
        <View key="2">
          {!isLoading &&
          data &&
          data?.pieces.filter((v) => v.favorited).length > 0 ? (
            <MasonryList
              data={data.pieces.filter((v) => v.favorited)}
              keyExtractor={(item): string => item.id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, i }) => {
                const piece = item as Piece
                return (
                  <Image piece={piece} index={i} length={data.pieces.length} />
                )
              }}
              refreshing={isLoading}
              onRefresh={() => mutate()}
            />
          ) : (
            <View className="flex flex-1 flex-col items-center justify-center">
              <Text className="text-3xl" family="lfeBold">
                No Favorites
              </Text>
              <Text className="mt-3">You can add new favorites by holding</Text>
              <Text>down on an image and selecting favorite image.</Text>
            </View>
          )}
        </View>
        <View key="3">
          <ArchiveScreen />
        </View>
      </PagerView>
    </ParentView>
  )
}
