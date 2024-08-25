import FAB from "@/components/create-actions/FAB"
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider"
import { defaultTags } from "@/constants/default_tags"
import { createTag } from "@/lib/api/tags/mutations"
import { getTags } from "@/lib/api/tags/queries"
import { db } from "@/lib/db"
import migrations from "@/lib/db/migrations/migrations"
import { useHomeStore } from "@/lib/store/home-store"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { useFonts } from "expo-font"
import { Stack, usePathname } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import "react-native-gesture-handler"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import "react-native-reanimated"
import useSWR from "swr"
import "../global.css"

export { ErrorBoundary } from "expo-router"

export const unstable_settings = {
  initialRouteName: "/(tabs)/",
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
  const homeStore = useHomeStore()
  const pathname = usePathname()
  const goodRoutes = ["/", "/two", "/account"]

  const fetcher = async () => {
    const tags = await getTags()

    if (tags.tags.length === 0) {
      for (const tag of defaultTags) {
        await createTag({ title: tag })
      }
    }
  }

  const propogateTags = useSWR("tags", fetcher)

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
            <Stack.Screen name="collection-viewer" />
          </Stack>
          {homeStore.isInArchive ||
          homeStore.isSelecting ||
          !goodRoutes.includes(pathname) ? null : (
            <FAB />
          )}
          <StatusBar style="dark" />
        </GluestackUIProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}
