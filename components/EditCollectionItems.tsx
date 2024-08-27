import { updateCollection } from "@/lib/api/collections/mutations"
import { Collection } from "@/lib/db/schema/collections"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { useRouter } from "expo-router"
import {
  MousePointerClickIcon,
  PencilIcon,
  SaveIcon,
  TrashIcon,
} from "lucide-react-native"
import { AnimatePresence, MotiView } from "moti"
import { FC, useRef, useState } from "react"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSWRConfig } from "swr"
import AnimatedPressable from "./AnimatedPressable"
import SheetHeader from "./SheetHeader"
import SheetMenuItem from "./SheetMenuItem"

interface EditCollectionItemsProps {
  collection: Collection
  close: (isDeleting?: boolean) => void
}

const EditCollectionItems: FC<EditCollectionItemsProps> = ({
  collection,
  close,
}) => {
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const titleEditBottomSheetRef = useRef<BottomSheetModal>(null)

  const [name, setName] = useState(collection.title)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  return (
    <View>
      <SheetHeader title="Edit Collection" close={close} />
      <View className="gap-y-4">
        <SheetMenuItem
          title="Collection Name"
          icon={<PencilIcon color="#494849" size={18} />}
          onPress={() => titleEditBottomSheetRef.current?.present()}
        />
        <SheetMenuItem
          title="Select Images"
          icon={<MousePointerClickIcon color="#494849" size={18} />}
          onPress={() => {}}
        />
        <SheetMenuItem
          isDestructive
          title="Delete Collection"
          icon={<TrashIcon color="#FF58AE" size={18} />}
          onPress={() => {
            setDeleteDialogOpen(true)
            close(true)
          }}
        />
      </View>
      <BottomSheetModal
        ref={titleEditBottomSheetRef}
        snapPoints={["19%"]}
        style={{
          borderRadius: 30,
          overflow: "hidden",
        }}
        handleComponent={null}
        backdropComponent={(e) => {
          return (
            <BottomSheetBackdrop
              onPress={() => titleEditBottomSheetRef.current?.dismiss()}
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
          style={{ paddingBottom: insets.bottom }}
        >
          <SheetHeader
            title="Edit Collection Name"
            close={() => titleEditBottomSheetRef.current?.dismiss()}
            actions={
              <AnimatePresence>
                {name !== collection.title && (
                  <AnimatedPressable
                    onPress={async () => {
                      await updateCollection(collection.id, {
                        ...collection,
                        title: name,
                      }).then(() => {
                        mutate(`collection-${collection.id}`)
                        mutate("collections")
                        titleEditBottomSheetRef.current?.dismiss()
                      })
                    }}
                  >
                    <MotiView
                      from={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-full bg-muted p-1.5"
                    >
                      <SaveIcon color="#494849" size={20} />
                    </MotiView>
                  </AnimatedPressable>
                )}
              </AnimatePresence>
            }
          />
          <BottomSheetTextInput
            placeholder="Name*"
            autoFocus
            className="rounded-full bg-muted p-5 text-accent placeholder:text-mutedForeground"
            value={name}
            onChange={(e) => setName(e.nativeEvent.text)}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  )
}

export default EditCollectionItems
