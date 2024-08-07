import { getAllCollectionsWithFirstPiece } from "@/lib/api/collections/queries"
import { updatePiece } from "@/lib/api/pieces/mutations"
import { Piece, UpdatePieceParams } from "@/lib/db/schema/pieces"
import { NotificationFeedbackType, notificationAsync } from "expo-haptics"
import { Image } from "expo-image"
import { PlusCircleIcon, PlusIcon, XCircleIcon } from "lucide-react-native"
import { FC } from "react"
import { TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useSWR, { useSWRConfig } from "swr"
import CollectionCreator from "./CollectionCreator"
import { Text } from "./StyledComponents"

interface AddToCollectionViewProps {
  selectedPiece: Piece
  close: () => void
}

const AddToCollectionView: FC<AddToCollectionViewProps> = ({
  selectedPiece,
  close,
}) => {
  const insets = useSafeAreaInsets()
  const { mutate } = useSWRConfig()
  const parsedCollections = JSON.parse(selectedPiece.collections) as string[]

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
                    const newPiece: UpdatePieceParams = {
                      collections: selectedPiece.collections,
                      filePath: selectedPiece.filePath,
                      id: selectedPiece.id,
                      favorited: selectedPiece.favorited!,
                      tags: selectedPiece.tags!,
                      archived: selectedPiece.archived!,
                      aspect_ratio: selectedPiece.aspect_ratio!,
                    }

                    if (parsedCollections.includes(collection.id)) {
                      newPiece.collections = JSON.stringify(
                        parsedCollections.filter((c) => c !== collection.id)
                      )

                      await updatePiece(selectedPiece.id, newPiece)

                      mutate("pieces")
                      collectionsMutate()

                      notificationAsync(NotificationFeedbackType.Success)
                    } else {
                      const newCollections = [
                        ...parsedCollections,
                        collection.id,
                      ]

                      newPiece.collections = JSON.stringify(newCollections)

                      await updatePiece(selectedPiece.id, newPiece)

                      mutate("pieces")
                      collectionsMutate()

                      notificationAsync(NotificationFeedbackType.Success)
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
                  {parsedCollections.includes(collection.id) ? (
                    <XCircleIcon color="#AAAAAA" />
                  ) : (
                    <PlusCircleIcon color="#AAAAAA" />
                  )}
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

export default AddToCollectionView
