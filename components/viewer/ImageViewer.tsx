import { windowHeight } from "@/constants/window"
import { deletePiece } from "@/lib/api/pieces/mutations"
import { getOrderedPiecesWithoutId } from "@/lib/api/pieces/queries"
import { Piece } from "@/lib/db/schema/pieces"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { NotificationFeedbackType, notificationAsync } from "expo-haptics"
import { useRouter } from "expo-router"
import { Edit2Icon, PlusIcon } from "lucide-react-native"
import { FC, useRef, useState } from "react"
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
import useSWR, { useSWRConfig } from "swr"
import AddToCollectionView from "../AddToCollectionView"
import AlertDialog from "../AlertDialog"
import ImageList from "../ImageList"
import SheetHeader from "../SheetHeader"
import EditView from "./EditView"

interface ImageViewerProps {
  data: Piece
  id: string
}

const ImageViewer: FC<ImageViewerProps> = ({ data, id }) => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const translationY = useSharedValue(1)
  const translationYControls = useSharedValue(1)
  const bottomsheetRef = useRef<BottomSheetModal>(null)
  const editBottomSheetRef = useRef<BottomSheetModal>(null)
  const { mutate } = useSWRConfig()

  const otherFetcher = async () => getOrderedPiecesWithoutId(id)
  const otherData = useSWR(id + "other", otherFetcher)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

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
            height: "100%",
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
            bottom: insets.bottom + 50,
          },
        ]}
      >
        <Pressable
          onPress={() => bottomsheetRef.current?.present()}
          className="flex h-14 w-[40%] items-center justify-center rounded-full border border-muted/10 bg-accent"
        >
          <PlusIcon color="white" />
        </Pressable>
        <TouchableOpacity
          onPress={() => editBottomSheetRef.current?.present()}
          className="bg-cosmosMuted flex size-14 items-center justify-center rounded-full"
        >
          <Edit2Icon color="white" />
        </TouchableOpacity>
      </Animated.View>
      <BottomSheetModal
        ref={bottomsheetRef}
        detached
        bottomInset={insets.bottom}
        snapPoints={["57%"]}
        style={{
          marginHorizontal: 14,
          borderRadius: 30,
          overflow: "hidden",
        }}
        handleComponent={null}
        backdropComponent={(e) => {
          return (
            <BottomSheetBackdrop
              onPress={() => bottomsheetRef.current?.dismiss()}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              style={[e.style, { backgroundColor: "rgba(0,0,0,0.7)" }]}
              animatedIndex={e.animatedIndex}
              animatedPosition={e.animatedPosition}
            />
          )
        }}
        backgroundStyle={{
          backgroundColor: "#FFFFFE",
        }}
      >
        <BottomSheetView className="px-8" style={{ flex: 1, flexGrow: 1 }}>
          <AddToCollectionView
            selectedPiece={data}
            close={() => bottomsheetRef.current?.dismiss()}
          />
        </BottomSheetView>
      </BottomSheetModal>
      <BottomSheetModal
        ref={editBottomSheetRef}
        detached
        bottomInset={insets.bottom}
        snapPoints={["48%"]}
        style={{
          marginHorizontal: 14,
          borderRadius: 30,
          overflow: "hidden",
        }}
        handleComponent={null}
        backdropComponent={(e) => {
          return (
            <BottomSheetBackdrop
              onPress={() => editBottomSheetRef.current?.dismiss()}
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
        <BottomSheetView className="flex-1 px-8 pb-5">
          <SheetHeader
            title={isEditing ? "Edit Tags" : "Edit Photo"}
            close={() => {
              if (isEditing) {
                setIsEditing(false)
              } else {
                editBottomSheetRef.current?.dismiss()
              }
            }}
            actions={
              <>
                {isEditing && (
                  <View className="rounded-full bg-muted p-1.5">
                    <PlusIcon color="#494849" size={20} />
                  </View>
                )}
              </>
            }
          />
          <EditView
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            close={(isDeleting) => {
              if (isDeleting) {
                editBottomSheetRef.current?.dismiss()
                setDeleteDialogOpen(true)
                setIsEditing(false)
              } else {
                editBottomSheetRef.current?.dismiss()
                setIsEditing(false)
              }
            }}
            {...data}
          />
        </BottomSheetView>
      </BottomSheetModal>

      <AlertDialog
        open={deleteDialogOpen}
        type="delete"
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={async () => {
          await deletePiece(data.id!)
          mutate(data.id)
          mutate("pieces")
          notificationAsync(NotificationFeedbackType.Success)
          setDeleteDialogOpen(false)
          router.back()
        }}
      />
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
        <View className="px-2">
          {otherData.data && (
            <ImageList
              pieces={otherData.data.pieces}
              isLoading={otherData.isLoading}
              type="Clothes"
            />
          )}
        </View>
      </Animated.ScrollView>
    </View>
  )
}

export default ImageViewer
