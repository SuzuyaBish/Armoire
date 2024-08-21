import { FC } from "react"
import { View } from "react-native"
import AnimatedPressable from "../AnimatedPressable"
import { Text } from "../StyledComponents"

interface FABMenuItemProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  onPress?: () => void
}

const FABMenuItem: FC<FABMenuItemProps> = ({
  icon,
  title,
  description,
  color,
  onPress,
}) => {
  return (
    <AnimatedPressable onPress={onPress} modest>
      <View className="flex flex-row gap-x-4 rounded-[18px] border border-accent bg-[#0F100F] p-5">
        <View
          className="flex size-10 items-center justify-center rounded-full"
          style={{
            backgroundColor: color,
          }}
        >
          {icon}
        </View>
        <View className="gap-y-1">
          <Text className="text-lg text-white" family="familySemiBold">
            {title}
          </Text>
          <Text className="text-sm text-muted/50">{description}</Text>
        </View>
      </View>
    </AnimatedPressable>
  )
}

export default FABMenuItem
