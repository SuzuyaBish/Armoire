import Image from "@/components/Image"
import { Piece } from "@/lib/db/schema/pieces"
import { PlusIcon } from "lucide-react-native"
import { MotiView } from "moti"
import { FC } from "react"
import { ScrollView, View } from "react-native"
import Animated, { LinearTransition } from "react-native-reanimated"
import { Text } from "./StyledComponents"

interface ImageListProps {
  pieces: Piece[]
  isLoading: boolean
  type: "Clothes" | "Favorites" | "Archives"
}

const ImageList: FC<ImageListProps> = ({ pieces, isLoading, type }) => {
  if (!isLoading) {
    if (pieces.length > 0) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 overflow-visible"
        >
          <Animated.View className="flex flex-row flex-wrap justify-between">
            {pieces.map((piece, i) => {
              return (
                <MotiView
                  key={piece.id}
                  layout={LinearTransition.springify()
                    .stiffness(1000)
                    .damping(500)
                    .mass(3)}
                >
                  <Image piece={piece} index={i} length={pieces.length} />
                </MotiView>
              )
            })}
          </Animated.View>
        </ScrollView>
      )
    } else {
      return (
        <View className="flex flex-1 items-center justify-center">
          {type === "Clothes" ? (
            <View className="flex flex-1 flex-col items-center justify-center">
              <Text className="text-3xl" family="lfeBold">
                No {type}
              </Text>
              <Text className="mt-3">You can add new clothes by</Text>
              <View className="flex flex-row items-center gap-x-1">
                <Text>clicking on the</Text>
                <PlusIcon size={14} color="black" />
                <Text>button.</Text>
              </View>
            </View>
          ) : (
            <View className="flex flex-1 flex-col items-center justify-center">
              <Text className="text-3xl" family="lfeBold">
                No {type}
              </Text>
              <Text className="mt-3">You can add new {type} by holding</Text>
              <Text>
                down on an image and selecting{" "}
                {type
                  .split("")
                  .slice(0, type.length - 1)
                  .join("")}{" "}
                image.
              </Text>
            </View>
          )}
        </View>
      )
    }
  }
}

export default ImageList
