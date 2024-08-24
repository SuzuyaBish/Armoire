import { useFabStore } from "@/lib/store/fab-store"
import React from "react"
import { Pressable } from "react-native"

export default function FABOverlay() {
  const fabStore = useFabStore()

  if (fabStore.stage === "2") {
    return (
      <Pressable
        className="absolute bottom-0 left-0 right-0 top-0 z-10"
        onPress={() => fabStore.setStage("1")}
      />
    )
  }
}
