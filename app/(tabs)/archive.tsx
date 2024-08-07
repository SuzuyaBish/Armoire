import Image from "@/components/Image"
import { ParentView } from "@/components/StyledComponents"
import { getOrderedArchived } from "@/lib/api/pieces/queries"
import { Piece } from "@/lib/db/schema/pieces"

import MasonryList from "@react-native-seoul/masonry-list"
import React from "react"
import useSWR from "swr"

export default function ArchiveScreen() {
  const { data, isLoading, mutate } = useSWR("archived", getOrderedArchived)
  return (
    <ParentView>
      {data && data.pieces.length > 0 && (
        <MasonryList
          data={data.pieces}
          keyExtractor={(item): string => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, i }) => {
            const piece = item as Piece
            return <Image piece={piece} index={i} length={data.pieces.length} />
          }}
          refreshing={isLoading}
          onRefresh={() => mutate()}
        />
      )}
    </ParentView>
  )
}
