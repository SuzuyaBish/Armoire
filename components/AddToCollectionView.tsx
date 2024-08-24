import { getAllCollectionsWithFirstPiece } from "@/lib/api/collections/queries"
import { updatePiece } from "@/lib/api/pieces/mutations"
import { Piece, UpdatePieceParams } from "@/lib/db/schema/pieces"
import { NotificationFeedbackType, notificationAsync } from "expo-haptics"
import { Image } from "expo-image"
import { PlusIcon, XIcon } from "lucide-react-native"
import { FC } from "react"
import { ScrollView, TouchableOpacity, View } from "react-native"
import useSWR, { useSWRConfig } from "swr"
import CollectionCreator from "./CollectionCreator"
import SheetHeader from "./SheetHeader"
import { Text } from "./StyledComponents"

interface AddToCollectionViewProps {
  selectedPiece: Piece
  close: () => void
}

const AddToCollectionView: FC<AddToCollectionViewProps> = ({
  selectedPiece,
  close,
}) => {
  const { mutate } = useSWRConfig()
  const parsedCollections = JSON.parse(selectedPiece.collections) as string[]

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
                  className="flex flex-row items-center justify-between rounded-2xl bg-muted p-3"
                >
                  <View className="flex flex-row items-center gap-x-4">
                    <View className="flex size-14 items-center justify-center overflow-hidden rounded-lg">
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
                        <View className="size-full bg-mutedForeground/50" />
                      )}
                    </View>
                    <View className="flex flex-col">
                      <Text className="text-lg" family="lfeSemiBold">
                        {collection.title}
                      </Text>
                      <Text className="text-sm text-mutedForeground">
                        {collection.piecesData.length} Photos
                      </Text>
                    </View>
                  </View>
                  {parsedCollections.includes(collection.id) ? (
                    <XIcon color="#AAAAAA" />
                  ) : (
                    <PlusIcon color="#AAAAAA" />
                  )}
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

export default AddToCollectionView
