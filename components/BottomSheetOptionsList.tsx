import { cn } from "@/lib/utils"
import { FC } from "react"
import { Pressable, View } from "react-native"
import { Text } from "./StyledComponents"

export type BottomSheetOptionItem = {
  icon: JSX.Element
  text: string
  onPress: () => void
}

interface BottomSheetOptionsListProps {
  items: BottomSheetOptionItem[]
  otherItems?: JSX.Element[]
  roundBottom?: boolean
}

const BottomSheetOptionsList: FC<BottomSheetOptionsListProps> = ({
  items,
  otherItems,
  roundBottom = true,
}) => {
  return (
    <View className="flex flex-col">
      {items.map((item, index) => {
        return (
          <Pressable
            key={index}
            className={cn(
              "flex flex-row items-center justify-between bg-muted px-7 py-4",
              index === 0 && "rounded-t-2xl border-b border-cosmosMutedText/10",
              index === items.length - 1 && roundBottom && "rounded-b-2xl",
              index !== 0 &&
                index !== items.length - 1 &&
                "border-b border-cosmosMutedText/10"
            )}
          >
            <Text className="text-lg">{item.text}</Text>
            {item.icon}
          </Pressable>
        )
      })}
      {otherItems &&
        otherItems.map((item, index) => {
          return <View key={index}>{item}</View>
        })}
    </View>
  )
}

export default BottomSheetOptionsList
