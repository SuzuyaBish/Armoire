import AppBar from "@/components/AppBar"
import ImageList from "@/components/ImageList"
import { ParentView } from "@/components/StyledComponents"
import { getCollectionWithPieces } from "@/lib/api/collections/queries"
import { useLocalSearchParams } from "expo-router"
import { EditIcon } from "lucide-react-native"
import React from "react"
import { Pressable } from "react-native"
import useSWR from "swr"

type CollectionViewerProps = {
  id: string
}

export default function CollectionViewer() {
  const { id } = useLocalSearchParams() as CollectionViewerProps
  const fetcher = async () => getCollectionWithPieces(id)
  const { data, isLoading } = useSWR(`collection-${id}`, fetcher)
  return (
    <ParentView hasInsets hasPadding>
      {data && data.collection && (
        <AppBar
          title={data?.collection?.title}
          custom={false}
          hasBackButton
          action={
            <Pressable>
              <EditIcon size={22} color="#242424" />
            </Pressable>
          }
        />
      )}
      {data && data.piecesData && (
        <ImageList
          pieces={data.piecesData}
          isLoading={isLoading}
          type="Clothes"
        />
      )}
    </ParentView>
  )
}
