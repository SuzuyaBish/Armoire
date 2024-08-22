import Image from "@/components/Image"
import { getOrderedArchived } from "@/lib/api/pieces/queries"

import { MotiView } from "moti"
import React from "react"
import { Animated, ScrollView } from "react-native"
import { LinearTransition } from "react-native-reanimated"
import useSWR from "swr"

export default function ArchiveScreen() {
  const { data, isLoading } = useSWR("archived", getOrderedArchived)
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 overflow-visible"
      key="1"
    >
      {!isLoading && data && data?.pieces.length > 0 && (
        <Animated.View className="flex flex-row flex-wrap justify-between">
          {data.pieces.map((piece, i) => {
            return (
              <MotiView
                key={piece.id}
                layout={LinearTransition.springify()
                  .stiffness(1000)
                  .damping(500)
                  .mass(3)}
              >
                <Image piece={piece} index={i} length={data.pieces.length} />
              </MotiView>
            )
          })}
        </Animated.View>
      )}
    </ScrollView>
  )
}
