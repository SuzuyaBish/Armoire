import { ParentView, Text } from "@/components/StyledComponents"
import { windowWidth } from "@/constants/window"
import { getAllCollectionsWithFirstPiece } from "@/lib/api/collections/queries"
import { getOrderedPieces } from "@/lib/api/pieces/queries"
import { Image } from "expo-image"
import { SettingsIcon } from "lucide-react-native"
import React from "react"
import { Pressable, ScrollView, TouchableOpacity, View } from "react-native"
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated"
import useSWR from "swr"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function AccountScreen() {
  const { data, isLoading, mutate } = useSWR(
    "collections",
    getAllCollectionsWithFirstPiece
  )
  const { data: allData, mutate: allMutate } = useSWR(
    "pieces",
    getOrderedPieces
  )

  const dimension = windowWidth / 2 - 24
  return (
    <ParentView hasInsets hasPadding className="relative px-4">
      <View className="mb-6 mt-3 flex flex-row items-center justify-between">
        <View>
          <SettingsIcon size={24} color="transparent" />
        </View>
        <Pressable className="rounded-full border border-muted/10 bg-muted px-12 py-4">
          <Text family="lfeSemiBold">Search Collections</Text>
        </Pressable>
        <TouchableOpacity>
          <SettingsIcon size={24} color="#242424" />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex flex-row flex-wrap justify-between">
          <View className="mb-5 flex flex-col">
            {allData && allData.pieces.length > 0 ? (
              <Animated.View
                layout={LinearTransition}
                entering={FadeIn.delay(100)}
                className="flex flex-row items-center justify-between overflow-hidden rounded-2xl"
                style={{
                  width: dimension,
                  aspectRatio: 1,
                }}
              >
                <Image
                  source={{ uri: allData?.pieces[0].filePath }}
                  contentFit="cover"
                  style={{
                    width: allData.pieces.length > 1 ? "50%" : "100%",
                    height: "100%",
                  }}
                />
                {allData?.pieces.length > 1 && (
                  <View
                    className="flex flex-col"
                    style={{
                      width: "50%",
                      height: "100%",
                    }}
                  >
                    <Image
                      source={{ uri: allData?.pieces[1].filePath }}
                      contentFit="cover"
                      style={{
                        width: "100%",
                        height: allData?.pieces?.length > 2 ? "50%" : "100%",
                      }}
                    />
                    {allData.pieces.length > 2 && (
                      <Image
                        source={{ uri: allData?.pieces[2].filePath }}
                        contentFit="cover"
                        style={{
                          width: "100%",
                          height: "50%",
                        }}
                      />
                    )}
                  </View>
                )}
              </Animated.View>
            ) : (
              <View
                className="rounded-2xl bg-muted"
                style={{
                  width: dimension,
                  aspectRatio: 1,
                }}
              />
            )}
            <View className="mt-2">
              <Text family="lfeSemiBold">All Elements</Text>
              <Text className="text-sm text-mutedForeground">
                {allData?.pieces.length}{" "}
                {allData?.pieces.length! > 1 ? "photos" : "photo"}
              </Text>
            </View>
          </View>
          {!isLoading && data && data.allData && data.allData.length > 0 && (
            <>
              {data.allData.map((collection, index) => {
                return (
                  <AnimatedPressable
                    layout={LinearTransition}
                    entering={FadeIn.delay(100 * (index + 1))}
                    key={collection.id}
                    className="mb-5"
                  >
                    {collection.coverImage ? (
                      <Image
                        source={{ uri: collection.coverImage }}
                        style={{
                          width: dimension,
                          aspectRatio: 1,
                        }}
                      />
                    ) : (
                      <View className="overflow-hidden rounded-2xl">
                        {collection.piecesData.length > 0 ? (
                          <Image
                            source={{ uri: collection.piecesData[0].filePath }}
                            style={{
                              width: dimension,
                              aspectRatio: 1,
                            }}
                          />
                        ) : (
                          <View
                            className="bg-muted"
                            style={{
                              width: dimension,
                              aspectRatio: 1,
                            }}
                          />
                        )}
                      </View>
                    )}
                    <View className="mt-2">
                      <Text family="lfeSemiBold">{collection.title}</Text>
                      <Text className="text-sm text-mutedForeground">
                        {collection.piecesData.length} photos
                      </Text>
                    </View>
                  </AnimatedPressable>
                )
              })}
            </>
          )}
        </View>
      </ScrollView>
    </ParentView>
  )
}
