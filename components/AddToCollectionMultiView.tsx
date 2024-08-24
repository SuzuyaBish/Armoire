import { getAllCollectionsWithFirstPiece } from "@/lib/api/collections/queries"
import { updatePiece } from "@/lib/api/pieces/mutations"
import { UpdatePieceParams } from "@/lib/db/schema/pieces"
import { useHomeStore } from "@/lib/store/home-store"
import { NotificationFeedbackType, notificationAsync } from "expo-haptics"
import { Image } from "expo-image"
import { PlusCircleIcon, PlusIcon } from "lucide-react-native"
import { FC } from "react"
import { ScrollView, TouchableOpacity, View } from "react-native"
import useSWR, { useSWRConfig } from "swr"
import CollectionCreator from "./CollectionCreator"
import SheetHeader from "./SheetHeader"
import { Text } from "./StyledComponents"

interface AddToCollectionMultiViewProps {
  close: () => void
}

const AddToCollectionMultiView: FC<AddToCollectionMultiViewProps> = ({
  close,
}) => {
  const { mutate } = useSWRConfig()
  const homeStore = useHomeStore()

  const {
    data,
    isLoading,
    mutate: collectionsMutate,
  } = useSWR("collections", getAllCollectionsWithFirstPiece)
  return (
    <View className="flex-1">
      <SheetHeader
        title="Add to Collection"
        close={close}
        actions={
          <CollectionCreator
            trigger={
              <View className="rounded-full bg-muted p-1.5">
                <PlusIcon color="#494849" size={20} />
              </View>
            }
          />
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {!isLoading && data && data.allData && data.allData.length > 0 ? (
          <View className="gap-y-5 pb-20">
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
                          collections: JSON.stringify(newCollections),
                          filePath: piece.filePath,
                          id: piece.id,
                          favorited: piece.favorited!,
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

                    notificationAsync(NotificationFeedbackType.Success)
                  }}
                  className="flex flex-row items-center justify-between rounded-2xl bg-muted p-3"
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
                      <Text className="text-cosmosMutedText text-sm">
                        {collection.piecesData.length} Photos
                      </Text>
                    </View>
                  </View>
                  <PlusCircleIcon color="#AAAAAA" />
                </TouchableOpacity>
              )
            })}
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
      </ScrollView>
    </View>
  )
}

export default AddToCollectionMultiView
