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
import { ArchiveRestoreIcon, PlusIcon, TrashIcon } from "lucide-react-native"
import { AnimatePresence, MotiView } from "moti/build"
import React from "react"
import { TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSWRConfig } from "swr"
import AddToCollectionMultiView from "./AddToCollectionMultiView"
import AlertDialog from "./AlertDialog"
import { Text } from "./StyledComponents"

export default function SelectionBar() {
  const insets = useSafeAreaInsets()
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
            <View className="flex w-full flex-row items-center justify-between overflow-hidden rounded-full bg-accent p-3">
              <View className="rounded-full px-6 py-3">
                <Text className="text-sm text-white">
                  {homeStore.selectedPieces.length} Selected
                </Text>
              </View>
              <View className="mr-6 flex grow flex-row items-center justify-evenly gap-x-4 border-x border-muted/20 px-3">
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
                <Text className="text-sm text-black">Done</Text>
              </TouchableOpacity>
            </View>
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
              onPress={() => collectionRef.current?.dismiss()}
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
          <AddToCollectionMultiView
            close={() => collectionRef.current?.dismiss()}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </>
  )
}
