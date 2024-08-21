import { springConfig } from "@/constants/spring-config"
import { windowHeight, windowWidth } from "@/constants/window"
import { pickMedia } from "@/lib/api/pieces/pick-photos"
import { useFabStore } from "@/lib/store/fab-store"
import { AnimatePresence } from "@legendapp/motion"
import {
  CameraIcon,
  ImagesIcon,
  NotebookIcon,
  PlusIcon,
} from "lucide-react-native"
import { MotiView } from "moti"
import { MotiPressable } from "moti/interactions"
import React from "react"
import { View } from "react-native"
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSWRConfig } from "swr"
import FABMenuItem from "./FABMenuItem"

export default function FAB() {
  const insets = useSafeAreaInsets()
  const fabStore = useFabStore()
  const { mutate } = useSWRConfig()

  const containerStyle = useAnimatedStyle(() => {
    if (fabStore.stage === "1") {
      return {
        bottom: withSpring(90 + 20, springConfig),
        right: withSpring(20, springConfig),
        left: withSpring(windowWidth - 56 - 20, springConfig),
        top: withSpring(windowHeight - 90 - insets.top - 16, springConfig),
        borderRadius: withSpring(56, springConfig),
      }
    }
    return {
      bottom: withSpring(insets.bottom, springConfig),
      right: withSpring(20, springConfig),
      left: withSpring(20, springConfig),
      top: withSpring(windowHeight / 1.5 - 12, springConfig),
      borderRadius: withSpring(20, springConfig),
    }
  })

  return (
    <Animated.View className="absolute bg-black" style={containerStyle}>
      <AnimatePresence>
        {fabStore.stage === "1" && (
          <MotiPressable
            onPress={() => fabStore.setStage("2")}
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <View
              className="flex items-center justify-center"
              style={{ width: 56, height: 56 }}
            >
              <PlusIcon color="white" />
            </View>
          </MotiPressable>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {fabStore.stage === "2" && (
          <MotiView
            className="gap-y-1 p-1"
            animate={{ opacity: 1 }}
            from={{ opacity: 0 }}
            transition={{ delay: 200, type: "spring" }}
            exitTransition={{ duration: 0 }}
          >
            <FABMenuItem
              icon={<ImagesIcon color="white" size={18} />}
              title="Pick Photos"
              description="Choose photos from your gallery"
              color="#3D8AF6"
              onPress={async () => {
                const didPick = await pickMedia()

                if (didPick) {
                  fabStore.setStage("1")
                }
              }}
            />
            <FABMenuItem
              icon={<CameraIcon color="white" size={18} />}
              title="Take Photo"
              description="Choose photos from your gallery"
              color="#73CC77"
            />
            <FABMenuItem
              icon={<NotebookIcon color="white" size={18} />}
              title="Create Collection"
              description="Choose photos from your gallery"
              color="#EC64AB"
            />
          </MotiView>
        )}
      </AnimatePresence>
    </Animated.View>
  )
}
