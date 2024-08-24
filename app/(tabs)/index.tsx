import AnimatedPressable from "@/components/AnimatedPressable"
import ArchiveScreen from "@/components/ArchiveScreen"
import FABOverlay from "@/components/FABOverlay"
import ImageList from "@/components/ImageList"
import SelectionBar from "@/components/SelectionBar"
import { ParentView, Text } from "@/components/StyledComponents"
import { getOrderedPiecesWithoutArchived } from "@/lib/api/pieces/queries"
import { useFabStore } from "@/lib/store/fab-store"
import { useHomeStore } from "@/lib/store/home-store"
import { cn } from "@/lib/utils"
import { useRef, useState } from "react"
import { View } from "react-native"
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
      <FABOverlay />
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
        {data && (
          <ImageList
            key="1"
            pieces={data?.pieces}
            isLoading={isLoading}
            type="Clothes"
          />
        )}
        <View key="2">
          {data && (
            <ImageList
              key="2"
              pieces={data?.pieces.filter((v) => v.favorited)}
              isLoading={false}
              type="Favorites"
            />
          )}
        </View>
        <View key="3">
          <ArchiveScreen />
        </View>
      </PagerView>
    </ParentView>
  )
}
