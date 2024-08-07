import { useRouter } from "expo-router"
import { ArrowLeft } from "lucide-react-native"
import { FC } from "react"
import { Pressable, View } from "react-native"
import { Text } from "./StyledComponents"

type AppBarWithChildren = {
  custom: true
  children: React.ReactNode
}

type AppBarWithoutChildren = {
  custom: false
  title: string
  hasBackButton?: boolean
  action?: React.ReactNode
  actionOnPress?: () => void
}

type AppBarProps = {} & (AppBarWithChildren | AppBarWithoutChildren)

const AppBar: FC<AppBarProps> = ({ ...props }) => {
  const router = useRouter()
  return (
    <View className="mb-6 mt-3 flex flex-row items-center justify-between">
      {props.custom ? (
        <>{props.children}</>
      ) : (
        <View className="flex w-full flex-row items-center justify-between px-4">
          {props.hasBackButton && (
            <Pressable onPress={() => router.back()} style={{ width: "20%" }}>
              <ArrowLeft size={26} color="white" />
            </Pressable>
          )}
          <View
            className="flex items-center justify-center"
            style={{ width: "60%" }}
          >
            <Text family="fancy" className="text-2xl">
              {props.title}
            </Text>
          </View>
          {props.action ? (
            <Pressable
              onPress={props.actionOnPress}
              style={{ width: "20%" }}
              className="flex w-full items-end justify-end"
            >
              {props.action}
            </Pressable>
          ) : (
            <View
              style={{ width: "20%" }}
              className="flex items-end justify-end"
            >
              <ArrowLeft size={26} color="transparent" />
            </View>
          )}
        </View>
      )}
    </View>
  )
}

export default AppBar
