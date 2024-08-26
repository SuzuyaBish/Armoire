import AnimatedPressable from "@/components/AnimatedPressable"
import AppBar from "@/components/AppBar"
import ImageList from "@/components/ImageList"
import SelectableImageList from "@/components/SelectableImageList"
import { ParentView, Text } from "@/components/StyledComponents"
import { getCollectionWithPieces } from "@/lib/api/collections/queries"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet"
import { Image } from "expo-image"
import { useLocalSearchParams } from "expo-router"
import { Edit3Icon, PlusIcon } from "lucide-react-native"
import React from "react"
import { ScrollView, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useSWR from "swr"

type CollectionViewerProps = {
  id: string
}

export default function CollectionViewer() {
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams() as CollectionViewerProps
  const fetcher = async () => getCollectionWithPieces(id)
  const { data, isLoading } = useSWR(`collection-${id}`, fetcher)
  const bottomSheetRef = React.useRef<BottomSheetModal>(null)
  return (
    <ParentView hasInsets hasPadding className="flex-1">
      {data && data.collection && (
        <View className="flex-1">
          <AppBar
            title={data?.collection?.title}
            showTitle={false}
            custom={false}
            hasBackButton
          />
          <ScrollView
            className="flex-1 flex-grow"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex flex-col items-center justify-center">
              {data.collection.coverImage ? (
                <Image source={{ uri: data.collection.coverImage }} />
              ) : (
                <AnimatedPressable modest>
                  <View className="flex size-28 items-center justify-center rounded-3xl bg-muted">
                    <PlusIcon size={24} color="black" />
                  </View>
                </AnimatedPressable>
              )}
              <Text className="mt-5 text-2xl" family="lfeSemiBold">
                {data.collection.title}
              </Text>
              <Text className="mt-3 text-mutedForeground">
                {data.piecesData.length} pieces
              </Text>
              <View className="mt-5 flex flex-row gap-x-5">
                <AnimatedPressable
                  modest
                  onPress={() => bottomSheetRef.current?.present()}
                >
                  <View className="flex size-14 items-center justify-center rounded-full bg-muted">
                    <PlusIcon size={18} color="black" />
                  </View>
                </AnimatedPressable>
                <AnimatedPressable modest>
                  <View className="flex size-14 items-center justify-center rounded-full bg-muted">
                    <Edit3Icon size={18} color="black" />
                  </View>
                </AnimatedPressable>
              </View>
            </View>

            {data && data.piecesData && (
              <View className="mt-10 pb-10">
                <ImageList
                  scrollable={false}
                  pieces={data.piecesData}
                  isLoading={isLoading}
                  type="Clothes"
                />
              </View>
            )}
          </ScrollView>
        </View>
      )}
      <BottomSheetModal
        ref={bottomSheetRef}
        topInset={insets.top}
        snapPoints={["100%"]}
        style={{
          borderRadius: 30,
        }}
        backdropComponent={(e) => {
          return (
            <BottomSheetBackdrop
              onPress={() => bottomSheetRef.current?.dismiss()}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              style={[e.style, { backgroundColor: "rgba(0,0,0,0.7)" }]}
              animatedIndex={e.animatedIndex}
              animatedPosition={e.animatedPosition}
            />
          )
        }}
        backgroundStyle={{ backgroundColor: "#FFFFFE" }}
      >
        <BottomSheetScrollView className="flex-1 flex-grow pb-5">
          <SelectableImageList
            collectionId={id}
            close={() => bottomSheetRef.current?.dismiss()}
          />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </ParentView>
  )
}
