import { deletePiece, updatePiece } from "@/lib/api/pieces/mutations"
import { Piece, UpdatePieceParams } from "@/lib/db/schema/pieces"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics"
import { useRouter } from "expo-router"
import {
  ArchiveIcon,
  FolderPlusIcon,
  MousePointerClickIcon,
  StarsIcon,
  TrashIcon,
} from "lucide-react-native"
import { FC, useRef, useState } from "react"
import { Pressable, TouchableOpacity } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSWRConfig } from "swr"
import AddToCollectionView from "./AddToCollectionView"
import BottomSheetOptionsList from "./BottomSheetOptionsList"
import ImageSaver from "./ImageSaver"
import { Text } from "./StyledComponents"
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "./ui/alert-dialog"
import { Toast, useToast } from "./ui/toast"

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

  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const collectionRef = useRef<BottomSheetModal>(null)

  const [toastId, setToastId] = useState("0")
  const [dialogOpen, setDeleteDialogOpen] = useState(false)

  const handleToast = () => {
    if (!toast.isActive(toastId)) {
      showNewToast()
    }
  }
  const showNewToast = () => {
    const newId = Math.random().toString()
    setToastId(newId)
    toast.show({
      id: newId,
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id
        return (
          <Toast
            nativeID={uniqueToastId}
            action="muted"
            variant="solid"
            className="rounded-full bg-white"
          >
            <Text className="text-black">Photo deleted successfully</Text>
          </Toast>
        )
      },
    })
  }
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/viewer",
          params: { id: piece.id },
        })
      }
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
          style={{ paddingBottom: insets.bottom }}
        >
          <BottomSheetOptionsList
            roundBottom={false}
            items={[
              {
                icon: <StarsIcon color="#D0D0D0" size={20} />,
                text: piece.favorited ? "Unfavorite Photo" : "Favorite Photo",
                onPress: async () => {
                  const updatedPiece: UpdatePieceParams = {
                    id: piece.id!,
                    title: piece.title,
                    age: piece.age!,
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
                },
              },
              {
                icon: <MousePointerClickIcon color="#D0D0D0" size={20} />,
                text: "Select Photo",
                onPress: () => {},
              },
              {
                icon: <FolderPlusIcon color="#D0D0D0" size={20} />,
                text: "Add to Collection",
                onPress: () => collectionRef.current?.present(),
              },
              {
                icon: <ArchiveIcon color="#D0D0D0" size={20} />,
                text: "Archive Photo",
                onPress: () => {},
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
                  setDeleteDialogOpen(true)
                  bottomSheetRef.current?.dismiss()
                },
              },
            ]}
          />
        </BottomSheetView>
      </BottomSheetModal>
      <AlertDialog
        isOpen={dialogOpen}
        onClose={() => setDeleteDialogOpen(!dialogOpen)}
        size="md"
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text family="fancy" className="text-2xl">
              Delete photo
            </Text>
          </AlertDialogHeader>
          <AlertDialogBody className="mb-4 mt-3">
            <Text>
              Deleting the photo cannot be undone. Make sure you have it saved
              to your gallery before deleting.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter className="">
            <TouchableOpacity
              className="rounded-lg bg-white px-5 py-2"
              onPress={() => setDeleteDialogOpen(false)}
            >
              <Text className="text-black">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-lg bg-destructive px-5 py-2"
              onPress={async () => {
                await deletePiece(piece.id)
                mutate("pieces")
                mutate("collections")
                setDeleteDialogOpen(false)
                handleToast()
              }}
            >
              <Text className="text-destructiveText">Delete</Text>
            </TouchableOpacity>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
