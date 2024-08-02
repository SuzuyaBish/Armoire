import { windowWidth } from "@/constants/window"
import { createCollection } from "@/lib/api/collections/mutations"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { SaveIcon, XIcon } from "lucide-react-native"
import React, { useRef, useState } from "react"
import { Pressable, TouchableOpacity, View } from "react-native"
import { useSWRConfig } from "swr"
import { Text } from "./StyledComponents"
import { Toast, useToast } from "./ui/toast"

export default function CollectionCreator({
  trigger,
}: {
  trigger?: React.ReactNode
}) {
  const toast = useToast()
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
            bottomSheetRef.current?.present()
          }}
          style={{ width: windowWidth / 3 - 10 }}
          className="flex h-full items-center justify-center"
        >
          <Text>Collection</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => {
            bottomSheetRef.current?.present()
          }}
        >
          {trigger}
        </Pressable>
      )}

      <BottomSheetModal
        ref={bottomSheetRef}
        enableDynamicSizing
        style={{
          borderRadius: 24,
          overflow: "hidden",
        }}
        handleComponent={null}
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
        <BottomSheetView>
          <View className="flex flex-row items-center justify-between border-b border-muted px-7 py-5">
            <TouchableOpacity
              className="flex size-11 items-center justify-center rounded-full bg-muted"
              onPress={() => bottomSheetRef.current?.dismiss()}
            >
              <XIcon size={18} color="white" />
            </TouchableOpacity>
            <Text family="fancy" className="text-2xl">
              New Collection
            </Text>
            {name === "" ? (
              <View className="flex size-11 items-center justify-center rounded-full bg-transparent" />
            ) : (
              <TouchableOpacity
                className="flex size-11 items-center justify-center rounded-full bg-muted"
                onPress={async () => {
                  await createCollection({
                    title: name,
                    coverImage: "",
                  }).then((v) => {
                    if (v.collection.id) {
                      mutate("collections")
                      handleToast()
                      setName("")
                      bottomSheetRef.current?.dismiss()
                    }
                  })
                }}
              >
                <SaveIcon size={18} color="white" />
              </TouchableOpacity>
            )}
          </View>
          <View className="p-4">
            <BottomSheetTextInput
              placeholder="Name*"
              autoFocus
              className="rounded-full bg-muted p-5 text-white placeholder:text-cosmosMutedText"
              value={name}
              onChange={(e) => setName(e.nativeEvent.text)}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  )
}
