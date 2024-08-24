import { Stack } from "expo-router"
import React from "react"

export default function CollectionsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="collection-viewer" />
    </Stack>
  )
}
