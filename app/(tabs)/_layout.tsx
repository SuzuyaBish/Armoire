import { Tabs } from "expo-router"
import { BedSingleIcon, SearchIcon, ShirtIcon } from "lucide-react-native"
import React from "react"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#242424",
        tabBarInactiveTintColor: "#BEBEC2",
        tabBarStyle: {
          height: 90,
          backgroundColor: "#FFFFFE",
          borderTopColor: "#BEBEC2",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tab One",
          tabBarIcon: ({ color }) => <ShirtIcon color={color} />,
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
        name="account"
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => <BedSingleIcon color={color} />,
        }}
      />
    </Tabs>
  )
}
