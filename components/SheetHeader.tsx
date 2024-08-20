import { XIcon } from "lucide-react-native"
import { FC } from "react"
import { View } from "react-native"
import AnimatedPressable from "./AnimatedPressable"
import { Text } from "./StyledComponents"

interface SheetHeaderProps {
  title: string
  actions?: React.ReactNode
  close: () => void
}

const SheetHeader: FC<SheetHeaderProps> = ({ title, actions, close }) => {
  return (
    <View className="mb-5 flex flex-row items-center justify-between border-b border-muted pb-5 pt-7">
      <Text className="text-xl text-accent" family="familyMedium">
        {title}
      </Text>
      <View className="flex flex-row items-center gap-x-4">
        {actions}
        <AnimatedPressable onPress={close}>
          <View className="rounded-full bg-muted p-1.5">
            <XIcon color="#494849" size={20} />
          </View>
        </AnimatedPressable>
      </View>
    </View>
  )
}

export default SheetHeader
