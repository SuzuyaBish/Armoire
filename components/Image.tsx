import { deleteFile } from "@/lib/api/files/mutations"
import { FileWithThumbnail } from "@/lib/db/schema/files"
import { capitalize } from "@/lib/utils"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { BlurView } from "expo-blur"
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics"
import { useRouter } from "expo-router"
import {
  FolderPlusIcon,
  MousePointerClickIcon,
  TrashIcon,
  XIcon,
} from "lucide-react-native"
import { FC, useRef } from "react"
import { Pressable, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSWRConfig } from "swr"
import { Text } from "./StyledComponents"

interface ImageProps {
  piece: FileWithThumbnail
  index: number
  length: number
}

const Image: FC<ImageProps> = ({ piece, index }) => {
  const router = useRouter()
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const insets = useSafeAreaInsets()
  const { mutate } = useSWRConfig()
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
      <BlurView
        className="absolute rounded-full px-2 py-1"
        tint="light"
        style={{
          bottom: 14,
          right: 14,
          overflow: "hidden",
        }}
      >
        <Text className="text-xs">{capitalize(piece.fileType)}</Text>
      </BlurView>
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={["27.5%"]}
        bottomInset={insets.bottom}
        handleComponent={null}
        detached
        style={{
          marginHorizontal: 20,
          borderRadius: 24,
          overflow: "hidden",
        }}
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
        <BottomSheetView className="">
          <View className="flex flex-row items-center justify-between border-b border-muted px-7 py-5">
            <Text family="fancy" className="text-2xl">
              Quick Actions
            </Text>
            <Pressable onPress={() => bottomSheetRef.current?.dismiss()}>
              <XIcon color="#D0D0D0" />
            </Pressable>
          </View>
          <View className="">
            <Pressable className="flex flex-row items-center justify-between px-7 py-4">
              <Text className="text-lg">Select Element</Text>
              <MousePointerClickIcon color="#D0D0D0" />
            </Pressable>
            <Pressable className="flex flex-row items-center justify-between border-y border-muted px-7 py-4">
              <Text className="text-lg">Move Element</Text>
              <FolderPlusIcon color="#D0D0D0" />
            </Pressable>
            <Pressable
              onPress={async () => {
                await deleteFile(piece.id)
                mutate("pieces")
                bottomSheetRef.current?.dismiss()
              }}
              className="flex flex-row items-center justify-between px-7 py-4"
            >
              <Text className="text-lg">Delete Element</Text>
              <TrashIcon color="#D0D0D0" />
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </Pressable>
  )
}

export default Image
