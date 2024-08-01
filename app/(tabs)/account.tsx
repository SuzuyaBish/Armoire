import { ParentView, Text } from "@/components/StyledComponents"
import { windowWidth } from "@/constants/window"
import { getCollections } from "@/lib/api/collections/queries"
import { getOrderedPieces } from "@/lib/api/pieces/queries"
import { Image } from "expo-image"
import { SettingsIcon } from "lucide-react-native"
import React from "react"
import { Pressable, TouchableOpacity, View } from "react-native"
import useSWR from "swr"

export default function AccountScreen() {
  const { data, isLoading } = useSWR("collections", getCollections)
  const { data: allData } = useSWR("pieces", getOrderedPieces)
  return (
    <ParentView hasInsets hasPadding className="relative px-4">
      <View className="mb-6 mt-3 flex flex-row items-center justify-between">
        <View>
          <SettingsIcon size={24} color="transparent" />
        </View>
        <Pressable className="rounded-xl bg-cosmosMuted px-12 py-4">
          <Text>Search Collections</Text>
        </Pressable>
        <TouchableOpacity>
          <SettingsIcon size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View className="flex flex-row flex-wrap items-center justify-between">
        {!isLoading && data && data.collections.length > 0 && (
          <>
            <View className="flex flex-col">
              {allData && allData.pieces.length > 0 && (
                <View
                  className="flex flex-row items-center justify-between"
                  style={{
                    width: windowWidth / 2 - 16,
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
                </View>
              )}
              <View className="mt-2">
                <Text>All Elements</Text>
                <Text className="text-cosmosMutedText">
                  {allData?.pieces.length} photos
                </Text>
              </View>
            </View>
            <View>
              {data.collections.map((collection) => {
                return (
                  <TouchableOpacity key={collection.id}>
                    <Text>{collection.title}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </>
        )}
      </View>
    </ParentView>
  )
}
