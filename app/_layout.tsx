import FAB from "@/components/create-actions/FAB"
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider"
import { db } from "@/lib/db"
import migrations from "@/lib/db/migrations/migrations"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
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
    familyRegular: require("../assets/fonts/family/Family Regular.ttf"),
    familyMedium: require("../assets/fonts/family/Family Medium.ttf"),
    familySemiBold: require("../assets/fonts/family/Family SemiBold.ttf"),
    lfeRegular: require("../assets/fonts/family/LFESans Regular.ttf"),
    lfeMedium: require("../assets/fonts/family/LFESans Medium.ttf"),
    lfeSemiBold: require("../assets/fonts/family/LFESans SemiBold.ttf"),
    lfeBold: require("../assets/fonts/family/LFESans Bold.ttf"),
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
            <Stack.Screen name="(editor)" />
          </Stack>
          <FAB />
          <StatusBar style="dark" />
        </GluestackUIProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}
