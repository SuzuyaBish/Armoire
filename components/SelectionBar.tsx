import {
  multiDeletePiece,
  multiUnarchivePiece,
} from "@/lib/api/pieces/mutations"
import { useHomeStore } from "@/lib/store/home-store"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { BlurView } from "expo-blur"
import { ArchiveRestoreIcon, PlusIcon, TrashIcon } from "lucide-react-native"
import { AnimatePresence, MotiView } from "moti/build"
import React from "react"
import { TouchableOpacity, View } from "react-native"
import { useSWRConfig } from "swr"
import AddToCollectionMultiView from "./AddToCollectionMultiView"
import AlertDialog from "./AlertDialog"
import { Text } from "./StyledComponents"

export default function SelectionBar() {
  const { mutate } = useSWRConfig()
  const homeStore = useHomeStore()
  const collectionRef = React.useRef<BottomSheetModal>(null)

  const [dialogOpen, setDeleteDialogOpen] = React.useState(false)

  return (
    <>
      <AnimatePresence>
        {homeStore.isSelecting && (
          <MotiView
            from={{ translateY: 100 }}
            animate={{ translateY: 0 }}
            exit={{ translateY: 100 }}
            className="absolute bottom-5 left-0 right-0 z-50 flex items-center justify-center rounded-full px-8"
          >
            <BlurView
              className="flex w-full flex-row items-center justify-between overflow-hidden rounded-full p-3"
              experimentalBlurMethod="dimezisBlurView"
            >
              <View className="rounded-full px-6 py-3">
                <Text className="text-sm">
                  {homeStore.selectedPieces.length} Selected
                </Text>
              </View>
              <View className="mr-6 flex grow flex-row items-center justify-evenly gap-x-4 border-x border-cosmosMutedText px-3">
                {homeStore.isInArchive ? (
                  <TouchableOpacity
                    onPress={async () => {
                      await multiUnarchivePiece(homeStore.selectedPieces)
                      mutate("pieces")
                      mutate("collections")
                      mutate("archived")
                      homeStore.setSelectedPieces([])
                      homeStore.setIsSelecting(false)
                    }}
                  >
                    <ArchiveRestoreIcon color="white" size={20} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => collectionRef.current?.present()}
                  >
                    <PlusIcon color="white" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setDeleteDialogOpen(true)}>
                  <TrashIcon color="white" size={20} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  homeStore.setSelectedPieces([])
                  homeStore.setIsSelecting(false)
                }}
                className="rounded-full bg-white px-6 py-3"
              >
                <Text className="text-sm text-black" family="medium">
                  Done
                </Text>
              </TouchableOpacity>
            </BlurView>
          </MotiView>
        )}
      </AnimatePresence>
      <AlertDialog
        type="deleteMultiple"
        open={dialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={async () => {
          await multiDeletePiece(homeStore.selectedPieces)
          mutate("pieces")
          mutate("collections")
          setDeleteDialogOpen(false)
          homeStore.setSelectedPieces([])
          homeStore.setIsSelecting(false)
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
          <AddToCollectionMultiView
            close={() => collectionRef.current?.dismiss()}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </>
  )
}
