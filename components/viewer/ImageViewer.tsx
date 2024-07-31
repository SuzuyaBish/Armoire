import { windowHeight } from "@/constants/window"
import { getOrderedPiecesWithoutId } from "@/lib/api/pieces/queries"
import { Piece } from "@/lib/db/schema/pieces"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import MasonryList from "@react-native-seoul/masonry-list"
import { useRouter } from "expo-router"
import { Edit2Icon, PlusIcon } from "lucide-react-native"
import { FC, useRef } from "react"
import { Pressable, TouchableOpacity, View } from "react-native"
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useSWR from "swr"
import { Text } from "../StyledComponents"

interface ImageViewerProps {
  data: Piece
  id: string
}

const ImageViewer: FC<ImageViewerProps> = ({ data, id }) => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const translationY = useSharedValue(1)
  const translationYControls = useSharedValue(1)

  const otherFetcher = async () => getOrderedPiecesWithoutId(id)
  const otherData = useSWR(id + "other", otherFetcher)

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value =
      1 - Math.min(1, Math.max(0, event.contentOffset.y / 500))
    translationYControls.value =
      1 - Math.min(1, Math.max(0, event.contentOffset.y / 100))
  })

  const scrollStyle = useAnimatedStyle(() => {
    return {
      opacity: translationY.value,
      transform: [
        {
          scale: translationY.value,
        },
      ],
    }
  })

  const scrollStyleControls = useAnimatedStyle(() => {
    return {
      opacity: translationYControls.value,
      transform: [
        {
          scale: translationYControls.value,
        },
      ],
    }
  })
  return (
    <View className="relative flex-1">
      <Animated.View
        className="mt-20 flex w-full items-center"
        style={[
          scrollStyle,
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
        ]}
      >
        <Animated.View
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}
          layout={LinearTransition}
          style={{
            width: "100%",
            aspectRatio: data?.aspect_ratio!,
            maxHeight: 500,
          }}
        >
          <Animated.Image
            source={{
              uri: data?.filePath,
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Animated.View>
      </Animated.View>

      <Animated.View
        className="absolute z-30 mt-5 flex w-full flex-row items-center justify-center gap-x-3"
        style={[
          scrollStyleControls,
          {
            bottom: insets.bottom + 70,
          },
        ]}
      >
        <View className="flex h-14 w-[40%] items-center justify-center rounded-full bg-white">
          <PlusIcon color="black" />
        </View>
        <TouchableOpacity
          onPress={() => {
            console.log("pressed")
            bottomSheetModalRef.current?.present()
          }}
          className="flex size-14 items-center justify-center rounded-full bg-cosmosMuted"
        >
          <Edit2Icon color="white" />
        </TouchableOpacity>
      </Animated.View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View
          className="z-20 bg-red-500"
          style={{
            marginBottom: windowHeight - insets.bottom - insets.top - 70,
          }}
        ></View>
        {otherData.data && otherData.data?.pieces.length > 0 && (
          <View className="z-40 flex flex-col bg-transparent">
            <MasonryList
              data={otherData.data.pieces}
              keyExtractor={(item): string => item.id}
              containerStyle={{
                marginBottom: insets.bottom,
                paddingHorizontal: 10,
              }}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, i }) => {
                const piece: Piece = item as Piece
                return (
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/viewer",
                        params: { id: piece.id },
                      })
                    }
                    style={{
                      width: "100%",
                      padding: 8,
                      aspectRatio: piece.aspect_ratio!,
                      position: "relative",
                    }}
                  >
                    <Animated.Image
                      source={{ uri: piece.filePath }}
                      entering={FadeIn.delay(i * 100)}
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </Pressable>
                )
              }}
            />
          </View>
        )}
      </Animated.ScrollView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        enableDynamicSizing
        handleComponent={null}
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
      >
        <BottomSheetView className="h-96">
          <Text>Hey</Text>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  )
}

export default ImageViewer
