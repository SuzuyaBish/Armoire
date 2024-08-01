import CollectionCreator from "@/components/CollectionCreator"
import ImagePicker from "@/components/ImagePicker"
import PhotoTaker from "@/components/PhotoTaker"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics"
import { Tabs } from "expo-router"
import {
  ArchiveIcon,
  HomeIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react-native"
import React, { useCallback, useRef } from "react"
import { TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function TabLayout() {
  const insets = useSafeAreaInsets()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#AAAAAA",
        tabBarStyle: {
          height: 90,
          backgroundColor: "#0E0E0E",
          borderTopColor: "#333",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tab One",
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => <SearchIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarButton: ({ style }) => (
            <TouchableOpacity
              onPress={() => {
                impactAsync(ImpactFeedbackStyle.Soft)
                handlePresentModalPress()
              }}
              style={[
                style,
                { alignItems: "center", justifyContent: "center" },
              ]}
            >
              <PlusIcon size={30} color="#AAAAAA" />
              <BottomSheetModal
                ref={bottomSheetModalRef}
                detached
                snapPoints={[64]}
                bottomInset={insets.bottom + 10}
                style={{
                  marginHorizontal: 10,
                  borderRadius: 16,
                  overflow: "hidden",
                  backgroundColor: "#1D1D1D",
                }}
                keyboardBehavior="interactive"
                backgroundStyle={{
                  backgroundColor: "#1D1D1D",
                }}
                backdropComponent={(e) => {
                  return (
                    <BottomSheetBackdrop
                      onPress={() => bottomSheetModalRef.current?.dismiss()}
                      appearsOnIndex={0}
                      disappearsOnIndex={-1}
                      style={[e.style, { backgroundColor: "rgba(0,0,0,0.6)" }]}
                      animatedIndex={e.animatedIndex}
                      animatedPosition={e.animatedPosition}
                    />
                  )
                }}
                handleComponent={null}
              >
                <BottomSheetView
                  className="flex w-full flex-row items-center bg-cosmosMuted"
                  style={{ height: 64 }}
                >
                  <ImagePicker />
                  <PhotoTaker />
                  <CollectionCreator />
                </BottomSheetView>
              </BottomSheetModal>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="archive"
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => <ArchiveIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => <UserIcon color={color} />,
        }}
      />
    </Tabs>
  )
}
