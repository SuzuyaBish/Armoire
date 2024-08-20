import { windowWidth } from "@/constants/window"
import { createCollection } from "@/lib/api/collections/mutations"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { AnimatePresence } from "@legendapp/motion"
import { selectionAsync } from "expo-haptics"
import { SaveIcon } from "lucide-react-native"
import { MotiView } from "moti"
import React, { useRef, useState } from "react"
import { Pressable } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSWRConfig } from "swr"
import AnimatedPressable from "./AnimatedPressable"
import SheetHeader from "./SheetHeader"
import { Text } from "./StyledComponents"
import { Toast, useToast } from "./ui/toast"

type CollectionCreatorProps = {
  trigger?: React.ReactNode
  className?: string
  onDone?: (done: boolean) => void
}

export default function CollectionCreator({
  trigger,
  className,
  onDone,
}: CollectionCreatorProps) {
  const toast = useToast()
  const insets = useSafeAreaInsets()
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const { mutate } = useSWRConfig()

  const [name, setName] = useState("")
  const [toastId, setToastId] = useState("0")

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
            <Text className="text-black">Collection created successfully</Text>
          </Toast>
        )
      },
    })
  }

  return (
    <>
      {!trigger ? (
        <Pressable
          onPress={() => {
            selectionAsync()
            bottomSheetRef.current?.present()
          }}
          style={{ width: windowWidth / 3 - 10 }}
          className="flex h-full items-center justify-center"
        >
          <Text className="text-accent">Collection</Text>
        </Pressable>
      ) : (
        <Pressable
          className={className}
          onPress={() => {
            selectionAsync()
            bottomSheetRef.current?.present()
          }}
        >
          {trigger}
        </Pressable>
      )}

      <BottomSheetModal
        ref={bottomSheetRef}
        detached
        bottomInset={insets.bottom + 60}
        snapPoints={["22%"]}
        style={{
          marginHorizontal: 14,
          marginBottom: 60,
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
          style={{ paddingBottom: insets.bottom }}
        >
          <SheetHeader
            title="Create Collection"
            close={() => bottomSheetRef.current?.dismiss()}
            actions={
              <AnimatePresence>
                {name.length > 0 && (
                  <AnimatedPressable
                    onPress={async () => {
                      await createCollection({
                        title: name,
                        coverImage: "",
                      }).then((v) => {
                        if (v.collection.id) {
                          mutate("collections")
                          handleToast()
                          setName("")
                          onDone && onDone(true)
                          bottomSheetRef.current?.dismiss()
                        }
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
    </>
  )
}
