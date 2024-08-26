import { windowWidth } from "@/constants/window"
import { updatePiece } from "@/lib/api/pieces/mutations"
import { getPiecesNotInCollection } from "@/lib/api/pieces/queries"
import { Piece, UpdatePieceParams } from "@/lib/db/schema/pieces"
import { Image } from "expo-image"
import { PlusIcon } from "lucide-react-native"
import { MotiView } from "moti"
import React from "react"
import { Pressable, View } from "react-native"
import Animated, { LinearTransition } from "react-native-reanimated"
import useSWR, { useSWRConfig } from "swr"
import SheetHeader from "./SheetHeader"

export default function SelectableImageList({
  collectionId,
  close,
}: {
  collectionId: string
  close: () => void
}) {
  const fetcher = async () => await getPiecesNotInCollection(collectionId)
  const { data } = useSWR("other", fetcher)
  const [selected, setSelected] = React.useState<Piece[]>([])
  const { mutate } = useSWRConfig()

  if (data && data.pieces) {
    return (
      <View className="flex-1 px-2 pb-10">
        <View className="px-8">
          <SheetHeader
            title="Add to Collection"
            close={close}
            actions={
              <>
                {selected.length > 0 && (
                  <Pressable
                    className="rounded-full bg-muted p-1.5"
                    onPress={async () => {
                      for (const piece of selected) {
                        const collections = [
                          ...JSON.parse(piece.collections),
                          collectionId,
                        ]
                        const newPiece: UpdatePieceParams = {
                          id: piece.id,
                          collections: JSON.stringify(collections),
                          filePath: piece.filePath,
                          tags: piece.tags,
                          archived: piece.archived!,
                          favorited: piece.favorited,
                          aspect_ratio: piece.aspect_ratio,
                        }
                        console.log(newPiece)

                        await updatePiece(piece.id, newPiece)
                        mutate(`collection-${collectionId}`)
                        mutate("collections")
                      }

                      close()
                    }}
                  >
                    <PlusIcon color="#494849" size={20} />
                  </Pressable>
                )}
              </>
            }
          />
        </View>
        <View className="flex-1 overflow-visible">
          <Animated.View className="flex flex-row flex-wrap justify-between">
            {data.pieces.map((piece, i) => {
              return (
                <MotiView
                  key={piece.id}
                  animate={{
                    padding: selected.includes(piece) ? 4 : 0,
                    borderWidth: selected.includes(piece) ? 2 : 0,
                    borderRadius: 24,
                    borderColor: selected.includes(piece)
                      ? "black"
                      : "transparent",
                  }}
                  className="mb-4 h-80"
                  style={{
                    width: windowWidth / 2 - 14,
                  }}
                  layout={LinearTransition.springify()
                    .stiffness(1000)
                    .damping(500)
                    .mass(3)}
                >
                  <Pressable
                    className="overflow-hidden rounded-3xl"
                    onPress={() => {
                      if (selected.includes(piece)) {
                        setSelected(selected.filter((p) => p !== piece))
                      } else {
                        setSelected([...selected, piece])
                      }
                    }}
                  >
                    <Image
                      source={{ uri: piece.filePath }}
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </Pressable>
                </MotiView>
              )
            })}
          </Animated.View>
        </View>
      </View>
    )
  }
}
