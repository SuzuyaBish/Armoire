import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider"
import { db } from "@/lib/db"
import migrations from "@/lib/db/migrations/migrations"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { useFonts } from "expo-font"
import { Stack, useRouter } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
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
              headerShown: false,
              headerTintColor: "#fff",
              headerBackVisible: false,
              headerBackTitleVisible: false,
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: "#0E0E0E",
              },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="viewer" />
            <Stack.Screen name="editor" />
          </Stack>
          <StatusBar style="light" />
        </GluestackUIProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}
