import { ParentView, Text } from "@/components/StyledComponents"
import { usePathname } from "expo-router"

export default function TabTwoScreen() {
  const pathname = usePathname()
  return (
    <ParentView hasInsets hasPadding>
      <Text>{pathname}</Text>
    </ParentView>
  )
}
