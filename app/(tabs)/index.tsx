import Image from "@/components/Image"
import { ParentView, Text } from "@/components/StyledComponents"
import { getOrderedPieces } from "@/lib/api/pieces/queries"
import { Piece } from "@/lib/db/schema/pieces"
import { cn } from "@/lib/utils"
import MasonryList from "@react-native-seoul/masonry-list"
import { useRef, useState } from "react"
import { TouchableOpacity, View } from "react-native"
import PagerView from "react-native-pager-view"
import useSWR from "swr"

export default function TabOneScreen() {
  const [selectedPage, setSelectedPage] = useState(0)
  const pagerRef = useRef<PagerView>(null)

  const { data, mutate, isLoading } = useSWR("pieces", getOrderedPieces)
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
            Favorites
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
        <View className="flex-1 overflow-visible" key="1">
          {!isLoading && data && data?.pieces.length > 0 && (
            <MasonryList
              data={data.pieces}
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
          )}
        </View>
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
              <Text className="text-3xl" family="fancy">
                No Favorites
              </Text>
              <Text className="mt-3">You can add new favorites by holding</Text>
              <Text>down on an image and selecting favorite image.</Text>
            </View>
          )}
        </View>
      </PagerView>
    </ParentView>
  )
}
