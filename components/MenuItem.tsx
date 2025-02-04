import { cn } from "@/lib/utils"
import { selectionAsync } from "expo-haptics"
import { ChevronRightIcon } from "lucide-react-native"
import { FC } from "react"
import { Pressable, View } from "react-native"
import { Text } from "./StyledComponents"

interface MenuItemProps extends React.ComponentProps<typeof Pressable> {
  border?: "top" | "bottom" | "both" | "none"
  rightItem?: React.ReactNode
  title: string
  description: string
}

const MenuItem: FC<MenuItemProps> = ({
  title,
  description,
  rightItem,
  ...props
}) => {
  return (
    <Pressable
      {...props}
      onPress={() => {
        selectionAsync()

        if (props.onPress) {
          props.onPress()
        }
      }}
      className={cn(
        "flex flex-row items-center justify-between px-4 py-7",
        props.border === "top" && "border-t border-cosmosMutedText/10",
        props.border === "bottom" && "border-b border-cosmosMutedText/10",
        props.border === "both" && "border-y border-cosmosMutedText/10",
        props.border === "none" && "border-none"
      )}
    >
      <View>
        <Text className="text-lg">{title}</Text>
        <Text className="text-sm text-cosmosMutedText">{description}</Text>
      </View>
      {rightItem ? rightItem : <ChevronRightIcon size={26} color="white" />}
    </Pressable>
  )
}

export default MenuItem
