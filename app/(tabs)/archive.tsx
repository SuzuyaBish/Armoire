import AppBar from "@/components/AppBar"
import Image from "@/components/Image"
import SelectionBar from "@/components/SelectionBar"
import { ParentView, Text } from "@/components/StyledComponents"
import { getOrderedArchived } from "@/lib/api/pieces/queries"
import { Piece } from "@/lib/db/schema/pieces"

import MasonryList from "@react-native-seoul/masonry-list"
import React from "react"
import { View } from "react-native"
import useSWR from "swr"

export default function ArchiveScreen() {
  const { data, isLoading, mutate } = useSWR("archived", getOrderedArchived)
  return (
    <ParentView hasInsets>
      <AppBar title="Archive" custom={false} />
      <SelectionBar />
      {data && data.pieces.length > 0 ? (
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
      ) : (
        <View className="flex flex-1 flex-col items-center justify-center">
          <Text className="text-3xl" family="fancy">
            Nothing Archived
          </Text>
          <Text className="mt-3">You can add to your archive by holding</Text>
          <Text>down on an image and selecting archive image.</Text>
        </View>
      )}
    </ParentView>
  )
}
