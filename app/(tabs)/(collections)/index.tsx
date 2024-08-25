import FABOverlay from "@/components/FABOverlay"
import { ParentView, Text } from "@/components/StyledComponents"
import { windowWidth } from "@/constants/window"
import { getAllCollectionsWithFirstPiece } from "@/lib/api/collections/queries"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { SettingsIcon, XIcon } from "lucide-react-native"
import { AnimatePresence } from "moti"
import { MotiPressable } from "moti/interactions"
import React from "react"
import { Pressable, ScrollView, TextInput, View } from "react-native"
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated"
import useSWR from "swr"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function AccountScreen() {
  const router = useRouter()

  const { data, isLoading } = useSWR(
    "collections",
    getAllCollectionsWithFirstPiece
  )

  const [searchClicked, setSearchClicked] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  const dimension = windowWidth / 2 - 24
  return (
    <ParentView hasInsets hasPadding className="relative px-4">
      <FABOverlay />
      <View className="mb-6 mt-3 flex flex-row items-center justify-between">
        <View>
          <SettingsIcon size={24} color="transparent" />
        </View>
        <Pressable
          onPress={() => setSearchClicked(true)}
          className="flex w-60 items-center justify-center rounded-full border border-muted/10 bg-muted py-4"
        >
          {searchClicked ? (
            <TextInput
              placeholder="Search Collections"
              autoFocus
              className="px-4 placeholder:text-mutedForeground"
              value={searchTerm}
              onChangeText={(text) => setSearchTerm(text)}
              style={{
                fontFamily: "lfeSemiBold",
              }}
            />
          ) : (
            <Text family="lfeSemiBold">Search Collections</Text>
          )}
        </Pressable>
        <AnimatePresence>
          {searchClicked ? (
            <MotiPressable
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onPress={() => {
                setSearchClicked(false)
                setSearchTerm("")
              }}
            >
              <XIcon size={24} color="#242424" />
            </MotiPressable>
          ) : (
            <MotiPressable
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SettingsIcon size={24} color="#242424" />
            </MotiPressable>
          )}
        </AnimatePresence>
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex flex-row flex-wrap justify-between">
          {!isLoading && data && data.allData && data.allData.length > 0 && (
            <>
              {data.allData
                .filter((v) => {
                  if (searchTerm === "") {
                    return v
                  } else if (
                    v.title.toLowerCase().includes(searchTerm.toLowerCase())
                  ) {
                    return v
                  }
                })
                .map((collection, index) => {
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
                              source={{
                                uri: collection.piecesData[0].filePath,
                              }}
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
