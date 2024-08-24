import FABOverlay from "@/components/FABOverlay"
import { ParentView, Text } from "@/components/StyledComponents"
import { windowWidth } from "@/constants/window"
import { getAllCollectionsWithFirstPiece } from "@/lib/api/collections/queries"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { SettingsIcon } from "lucide-react-native"
import React from "react"
import { Pressable, ScrollView, TouchableOpacity, View } from "react-native"
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated"
import useSWR from "swr"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function AccountScreen() {
  const router = useRouter()

  const { data, isLoading } = useSWR(
    "collections",
    getAllCollectionsWithFirstPiece
  )

  const dimension = windowWidth / 2 - 24
  return (
    <ParentView hasInsets hasPadding className="relative px-4">
      <FABOverlay />
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
          {!isLoading && data && data.allData && data.allData.length > 0 && (
            <>
              {data.allData.map((collection, index) => {
                return (
                  <AnimatedPressable
                    layout={LinearTransition}
                    entering={FadeIn.delay(100 * (index + 1))}
                    key={collection.id}
                    className="mb-5"
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/(collections)/collection-viewer",
                        params: { id: collection.id },
                      })
                    }
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
