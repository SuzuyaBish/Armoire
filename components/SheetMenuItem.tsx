import { cn } from "@/lib/utils"
import { FC } from "react"
import { View } from "react-native"
import AnimatedPressable from "./AnimatedPressable"
import { Text } from "./StyledComponents"

interface SheetMenuItemProps {
  title: string
  icon: React.ReactNode
  isDestructive?: boolean
  onPress: () => void
}

const SheetMenuItem: FC<SheetMenuItemProps> = ({
  title,
  icon,
  isDestructive = false,
  onPress,
  ...props
}) => {
  return (
    <AnimatedPressable {...props} onPress={onPress} modest>
      <View
        className={cn(
          "flex flex-row items-center gap-x-4 rounded-2xl p-3",
          isDestructive ? "bg-redColor/10" : "bg-muted"
        )}
      >
        {icon}
        <Text
          className={cn(
            "text-lg",
            isDestructive ? "text-redColor" : "text-accent"
          )}
          family="lfeSemiBold"
        >
          {title}
        </Text>
      </View>
    </AnimatedPressable>
  )
}

export default SheetMenuItem
