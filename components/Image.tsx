import { windowWidth } from "@/constants/window"
import { deletePiece, updatePiece } from "@/lib/api/pieces/mutations"
import { Piece, UpdatePieceParams } from "@/lib/db/schema/pieces"
import { useHomeStore } from "@/lib/store/home-store"
import { showNewToast } from "@/lib/toast"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import {
  ImpactFeedbackStyle,
  NotificationFeedbackType,
  impactAsync,
  notificationAsync,
} from "expo-haptics"
import { useRouter } from "expo-router"
import {
  ArchiveIcon,
  FolderPlusIcon,
  HeartCrackIcon,
  HeartIcon,
  MousePointerClickIcon,
  TrashIcon,
} from "lucide-react-native"
import { FC, useRef, useState } from "react"
import { Pressable, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSWRConfig } from "swr"
import AddToCollectionView from "./AddToCollectionView"
import AlertDialog from "./AlertDialog"
import ImageSaver from "./ImageSaver"
import SheetHeader from "./SheetHeader"
import SheetMenuItem from "./SheetMenuItem"
import { useToast } from "./ui/toast"

interface ImageProps {
  piece: Piece
  index: number
  length: number
}

const Image: FC<ImageProps> = ({ piece, index }) => {
  const toast = useToast()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { mutate } = useSWRConfig()
  const homeStore = useHomeStore()

  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const collectionRef = useRef<BottomSheetModal>(null)

  const [dialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <Pressable
      onPress={() => {
        if (homeStore.isSelecting) {
          if (homeStore.selectedPieces.includes(piece)) {
            homeStore.setSelectedPieces(
              homeStore.selectedPieces.filter((v) => v.id !== piece.id)
            )
          } else {
            homeStore.setSelectedPieces([...homeStore.selectedPieces, piece])
          }
        } else {
          router.push({
            pathname: "/viewer",
            params: { id: piece.id },
          })
        }
      }}
      onLongPress={() => {
        impactAsync(ImpactFeedbackStyle.Medium)
        bottomSheetRef.current?.present()
      }}
      className="h-80 overflow-hidden rounded-lg"
      style={{
        width: windowWidth / 2 - 8,
        padding: 8,
        position: "relative",
      }}
    >
      <Animated.Image
        source={{ uri: piece.filePath }}
        entering={FadeIn.delay(index * 100)}
        className="rounded-2xl"
        style={{
          height: "100%",
          width: "100%",
          borderWidth: homeStore.selectedPieces.includes(piece) ? 4 : 0,
          borderColor: homeStore.selectedPieces.includes(piece)
            ? "#586CC0"
            : "transparent",
        }}
      />
      <BottomSheetModal
        ref={bottomSheetRef}
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
        <BottomSheetView
          className="px-8"
          style={{ paddingBottom: insets.bottom + 20 }}
        >
          <SheetHeader
            title="Photo Options"
            close={() => bottomSheetRef.current?.dismiss()}
          />
          <View className="gap-y-4">
            <SheetMenuItem
              title={piece.favorited ? "Unfavorite Photo" : "Favorite Photo"}
              icon={
                piece.favorited ? (
                  <HeartCrackIcon color="#494849" size={18} />
                ) : (
                  <HeartIcon color="#494849" size={18} />
                )
              }
              onPress={async () => {
                const updatedPiece: UpdatePieceParams = {
                  id: piece.id!,
                  tags: piece.tags,
                  archived: piece.archived!,
                  filePath: piece.filePath,
                  aspect_ratio: piece.aspect_ratio!,
                  collections: piece.collections,
                  favorited: !piece.favorited,
                }

                await updatePiece(piece.id!, updatedPiece)
                mutate("pieces")
                notificationAsync(NotificationFeedbackType.Success)
                bottomSheetRef.current?.dismiss()
              }}
            />
            <SheetMenuItem
              title="Select Photo"
              icon={<MousePointerClickIcon color="#494849" size={18} />}
              onPress={() => {
                homeStore.setIsSelecting(true, piece.archived!)
                homeStore.setSelectedPieces([piece])
                bottomSheetRef.current?.dismiss()
              }}
            />
            <SheetMenuItem
              title="Add to Collection"
              icon={<FolderPlusIcon color="#494849" size={18} />}
              onPress={() => collectionRef.current?.present()}
            />
            <SheetMenuItem
              title={piece.archived ? "Unarchive Photo" : "Archive Photo"}
              icon={<ArchiveIcon color="#494849" size={18} />}
              onPress={async () => {
                const updatedPiece: UpdatePieceParams = {
                  id: piece.id!,
                  tags: piece.tags,
                  archived: !piece.archived,
                  filePath: piece.filePath,
                  aspect_ratio: piece.aspect_ratio!,
                  collections: piece.collections,
                  favorited: piece.favorited,
                }

                await updatePiece(piece.id!, updatedPiece)
                mutate("pieces")
                mutate("archived")
                bottomSheetRef.current?.dismiss()

                notificationAsync(NotificationFeedbackType.Success)
              }}
            />
            <ImageSaver {...piece} close={() => {}} />
            <SheetMenuItem
              isDestructive
              title="Delete Photo"
              icon={<TrashIcon color="#FF58AE" size={18} />}
              onPress={async () => {
                const updatedPiece: UpdatePieceParams = {
                  id: piece.id!,
                  tags: piece.tags,
                  archived: !piece.archived,
                  filePath: piece.filePath,
                  aspect_ratio: piece.aspect_ratio!,
                  collections: piece.collections,
                  favorited: piece.favorited,
                }

                await updatePiece(piece.id!, updatedPiece)
                mutate("pieces")
                mutate("archived")
                bottomSheetRef.current?.dismiss()

                notificationAsync(NotificationFeedbackType.Success)
              }}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
      <AlertDialog
        type="delete"
        open={dialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={async () => {
          await deletePiece(piece.id)
          mutate("pieces")
          mutate("collections")
          setDeleteDialogOpen(false)
          showNewToast({ toast: toast, body: "Photo deleted successfully!" })
        }}
      />
      <BottomSheetModal
        ref={collectionRef}
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
        <BottomSheetView
          className="px-8 pb-5"
          style={{ paddingBottom: insets.bottom }}
        >
          <AddToCollectionView
            selectedPiece={piece}
            close={() => collectionRef.current?.dismiss()}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </Pressable>
  )
}

export default Image
