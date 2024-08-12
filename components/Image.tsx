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
  selectionAsync,
} from "expo-haptics"
import { useRouter } from "expo-router"
import {
  ArchiveIcon,
  FolderPlusIcon,
  MousePointerClickIcon,
  StarsIcon,
  TrashIcon,
} from "lucide-react-native"
import { FC, useRef, useState } from "react"
import { Pressable } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSWRConfig } from "swr"
import AddToCollectionView from "./AddToCollectionView"
import AlertDialog from "./AlertDialog"
import BottomSheetOptionsList from "./BottomSheetOptionsList"
import ImageSaver from "./ImageSaver"
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
      style={{
        width: "100%",
        padding: 8,
        aspectRatio: piece.aspect_ratio!,
        position: "relative",
      }}
    >
      <Animated.Image
        source={{ uri: piece.filePath }}
        entering={FadeIn.delay(index * 100)}
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
        enableDynamicSizing
        style={{
          borderRadius: 24,
          overflow: "hidden",
        }}
        handleIndicatorStyle={{ backgroundColor: "#D0D0D0" }}
        backdropComponent={(e) => {
          return (
            <BottomSheetBackdrop
              onPress={() => bottomSheetRef.current?.dismiss()}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              style={[e.style, { backgroundColor: "rgba(0,0,0,0.6)" }]}
              animatedIndex={e.animatedIndex}
              animatedPosition={e.animatedPosition}
            />
          )
        }}
        backgroundStyle={{ backgroundColor: "#191919" }}
      >
        <BottomSheetView
          className="px-5 pt-3"
          style={{ paddingBottom: insets.bottom + 20 }}
        >
          <BottomSheetOptionsList
            roundBottom={false}
            items={[
              {
                icon: <StarsIcon color="#D0D0D0" size={20} />,
                text: piece.favorited ? "Unfavorite Photo" : "Favorite Photo",
                shown: !piece.archived,
                onPress: async () => {
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
                  bottomSheetRef.current?.dismiss()

                  notificationAsync(NotificationFeedbackType.Success)
                },
              },
              {
                icon: <MousePointerClickIcon color="#D0D0D0" size={20} />,
                text: "Select Photo",
                onPress: () => {
                  homeStore.setIsSelecting(true, piece.archived!)
                  homeStore.setSelectedPieces([piece])
                  bottomSheetRef.current?.dismiss()
                },
              },
              {
                icon: <FolderPlusIcon color="#D0D0D0" size={20} />,
                text: "Add to Collection",
                shown: !piece.archived,
                onPress: () => collectionRef.current?.present(),
              },
              {
                icon: <ArchiveIcon color="#D0D0D0" size={20} />,
                text: piece.archived ? "Unarchive Photo" : "Archive Photo",
                onPress: async () => {
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
                },
              },
            ]}
            otherItems={[
              <ImageSaver
                {...piece}
                close={() => bottomSheetRef.current?.dismiss()}
              />,
            ]}
            destructiveItems={[
              {
                icon: <TrashIcon color="#FC2A2C" size={20} />,
                text: "Delete Photo",
                onPress: async () => {
                  selectionAsync()
                  setDeleteDialogOpen(true)
                  bottomSheetRef.current?.dismiss()
                },
              },
            ]}
          />
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
        enableDynamicSizing
        style={{
          borderRadius: 24,
          overflow: "hidden",
        }}
        handleIndicatorStyle={{ backgroundColor: "#D0D0D0" }}
        backdropComponent={(e) => {
          return (
            <BottomSheetBackdrop
              onPress={() => collectionRef.current?.dismiss()}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              style={[e.style, { backgroundColor: "rgba(0,0,0,0.6)" }]}
              animatedIndex={e.animatedIndex}
              animatedPosition={e.animatedPosition}
            />
          )
        }}
        backgroundStyle={{ backgroundColor: "#191919" }}
      >
        <BottomSheetView>
          <AddToCollectionView
            close={() => collectionRef.current?.dismiss()}
            selectedPiece={piece}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </Pressable>
  )
}

export default Image
