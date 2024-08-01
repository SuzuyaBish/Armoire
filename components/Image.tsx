import { deletePiece } from "@/lib/api/pieces/mutations"
import { Piece } from "@/lib/db/schema/pieces"
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
  TrashIcon,
} from "lucide-react-native"
import { FC, useRef } from "react"
import { Pressable } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSWRConfig } from "swr"
import BottomSheetOptionsList from "./BottomSheetOptionsList"
import ImageSaver from "./ImageSaver"

interface ImageProps {
  piece: Piece
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
                icon: <MousePointerClickIcon color="#D0D0D0" size={20} />,
                text: "Select Photo",
                onPress: () => {},
              },
              {
                icon: <FolderPlusIcon color="#D0D0D0" size={20} />,
                text: "Add to Collection",
                onPress: () => {},
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
                  console.log("pressed")
                  await deletePiece(piece.id)
                  mutate("pieces")
                  bottomSheetRef.current?.dismiss()
                },
              },
            ]}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </Pressable>
  )
}

export default Image
