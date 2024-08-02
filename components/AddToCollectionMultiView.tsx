import { getAllCollectionsWithFirstPiece } from "@/lib/api/collections/queries"
import { updatePiece } from "@/lib/api/pieces/mutations"
import { UpdatePieceParams } from "@/lib/db/schema/pieces"
import { useHomeStore } from "@/lib/store/home-store"
import { Image } from "expo-image"
import { PlusCircleIcon, PlusIcon } from "lucide-react-native"
import { FC } from "react"
import { TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useSWR, { useSWRConfig } from "swr"
import CollectionCreator from "./CollectionCreator"
import { Text } from "./StyledComponents"

interface AddToCollectionMultiViewProps {
  close: () => void
}

const AddToCollectionMultiView: FC<AddToCollectionMultiViewProps> = ({
  close,
}) => {
  const insets = useSafeAreaInsets()
  const { mutate } = useSWRConfig()
  const homeStore = useHomeStore()

  const {
    data,
    isLoading,
    mutate: collectionsMutate,
  } = useSWR("collections", getAllCollectionsWithFirstPiece)
  return (
    <View
      style={{
        marginBottom: insets.bottom,
      }}
    >
      <View className="flex flex-row items-center justify-between border-b border-muted px-7 pb-3 pt-2">
        <View>
          <PlusIcon color="transparent" />
        </View>
        <Text className="text-2xl" family="fancy">
          Connect
        </Text>
        <CollectionCreator
          trigger={
            <View className="p-2">
              <PlusIcon color="#AAAAAA" />
            </View>
          }
        />
      </View>
      <View className="p-7">
        {!isLoading && data && data.allData && data.allData.length > 0 ? (
          <View className="gap-y-5">
            {data.allData.map((collection) => {
              return (
                <TouchableOpacity
                  key={collection.id}
                  onPress={async () => {
                    for (const piece of homeStore.selectedPieces) {
                      const parsedCollections = JSON.parse(
                        piece.collections
                      ) as string[]
                      if (!parsedCollections.includes(collection.id)) {
                        const newCollections = [
                          ...parsedCollections,
                          collection.id,
                        ]
                        const newPiece: UpdatePieceParams = {
                          title: piece.title,
                          collections: JSON.stringify(newCollections),
                          filePath: piece.filePath,
                          id: piece.id,
                          favorited: piece.favorited!,
                          age: piece.age!,
                          tags: piece.tags!,
                          archived: piece.archived!,
                          aspect_ratio: piece.aspect_ratio!,
                        }

                        await updatePiece(piece.id!, newPiece)

                        mutate("pieces")
                        collectionsMutate()

                        homeStore.setSelectedPieces([])
                        homeStore.setIsSelecting(false)

                        close()
                      }
                    }
                  }}
                  className="flex flex-row items-center justify-between"
                >
                  <View className="flex flex-row items-center gap-x-4">
                    <View className="flex size-14 items-center justify-center">
                      {collection.piecesData.length > 0 ? (
                        <Image
                          contentFit="cover"
                          contentPosition="center"
                          source={{ uri: collection.piecesData[0].filePath }}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      ) : (
                        <View className="size-full bg-muted" />
                      )}
                    </View>
                    <View className="flex flex-col">
                      <Text className="text-lg">{collection.title}</Text>
                      <Text className="text-sm text-cosmosMutedText">
                        {collection.piecesData.length} Photos
                      </Text>
                    </View>
                  </View>
                  <PlusCircleIcon color="#AAAAAA" />
                </TouchableOpacity>
              )
            })}
            <CollectionCreator
              trigger={
                <View className="flex flex-row items-center gap-x-4">
                  <View className="flex size-14 items-center justify-center bg-white">
                    <PlusIcon color="black" />
                  </View>
                  <Text className="text-lg">New Collection</Text>
                </View>
              }
            />
          </View>
        ) : (
          <CollectionCreator
            trigger={
              <View className="flex flex-row items-center gap-x-4">
                <View className="flex size-14 items-center justify-center bg-white">
                  <PlusIcon color="black" />
                </View>
                <Text className="text-lg">New Collection</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  )
}

export default AddToCollectionMultiView
