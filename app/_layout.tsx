import { Text } from "@/components/StyledComponents"
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider"
import { db } from "@/lib/db"
import migrations from "@/lib/db/migrations/migrations"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { useFonts } from "expo-font"
import { Stack, useRouter } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { ArrowLeftIcon } from "lucide-react-native"
import { useEffect } from "react"
import { TouchableOpacity, View } from "react-native"
import "react-native-gesture-handler"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import "react-native-reanimated"
import "../global.css"

export { ErrorBoundary } from "expo-router"

export const unstable_settings = {
  initialRouteName: "(tabs)",
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const { success, error: dbError } = useMigrations(db, migrations)
  const [loaded, error] = useFonts({
    favoritRegular: require("../assets/fonts/favorit/Favorit-Regular.ttf"),
    favoritLight: require("../assets/fonts/favorit/Favorit-Light.ttf"),
    favoritMedium: require("../assets/fonts/favorit/Favorit-Medium.ttf"),
    favoritBold: require("../assets/fonts/favorit/Favorit-Bold.ttf"),
    gtSuper: require("../assets/fonts/gt-super/GTSuperDisplay-Light.ttf"),
  })

  useEffect(() => {
    if (error || dbError) throw error
  }, [error, dbError])

  useEffect(() => {
    if (loaded && success) {
      SplashScreen.hideAsync()
    }
  }, [loaded, success])

  if (!loaded || !success) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const router = useRouter()
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <GluestackUIProvider mode="dark">
          <Stack
            screenOptions={{
              headerTintColor: "#fff",
              headerBackVisible: false,
              headerBackTitleVisible: false,
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: "#0E0E0E",
              },
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="viewer"
              options={{
                headerLeft: () => {
                  return (
                    <TouchableOpacity
                      onPress={() => router.back()}
                      onLongPress={() => router.dismissAll()}
                    >
                      <ArrowLeftIcon />
                    </TouchableOpacity>
                  )
                },
                headerTitle: ({ children }) => {
                  return (
                    <View className="rounded-full bg-cosmosMuted px-4 py-2">
                      <Text>{children}</Text>
                    </View>
                  )
                },
              }}
            />

            <Stack.Screen
              name="editor"
              options={{
                headerShown: false,
                headerLeft: () => {
                  return (
                    <TouchableOpacity
                      onPress={() => router.back()}
                      onLongPress={() => router.dismissAll()}
                    >
                      <ArrowLeftIcon />
                    </TouchableOpacity>
                  )
                },
                headerTitle: () => {
                  return (
                    <Text family="fancy" className="text-2xl">
                      Edit Photo
                    </Text>
                  )
                },
              }}
            />
          </Stack>
        </GluestackUIProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}
