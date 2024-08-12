import { cn } from "@/lib/utils"
import { FC } from "react"
import { Pressable, View } from "react-native"
import { Text } from "./StyledComponents"

export type BottomSheetOptionItem = {
  icon: JSX.Element
  text: string
  onPress: () => void
  shown?: boolean
}

interface BottomSheetOptionsListProps {
  items: BottomSheetOptionItem[]
  destructiveItems?: BottomSheetOptionItem[]
  otherItems?: JSX.Element[]
  roundBottom?: boolean
}

const BottomSheetOptionsList: FC<BottomSheetOptionsListProps> = ({
  items,
  destructiveItems,
  otherItems,
}) => {
  return (
    <View className="flex flex-col">
      {items
        .filter((item) => item.shown || item.shown === undefined)
        .map((item, index) => {
          const itemsLength = items.filter(
            (item) => item.shown || item.shown === undefined
          ).length
          return (
            <Pressable
              onPress={item.onPress}
              key={index}
              className={cn(
                "flex flex-row items-center justify-between bg-muted px-7 py-4",
                index === 0 &&
                  "rounded-t-2xl border-b border-cosmosMutedText/10",
                index === itemsLength - 1 && "rounded-b-2xl",
                index !== 0 &&
                  index !== itemsLength - 1 &&
                  "border-b border-cosmosMutedText/10"
              )}
            >
              <Text className="text-lg">{item.text}</Text>
              {item.icon}
            </Pressable>
          )
        })}
      <View className="mt-5">
        {otherItems &&
          otherItems.map((item, index) => {
            return <View key={index}>{item}</View>
          })}
      </View>
      <View className="mt-5">
        {destructiveItems &&
          destructiveItems.map((item, index) => {
            return (
              <Pressable
                onPress={item.onPress}
                key={index}
                className={cn(
                  "flex flex-row items-center justify-between bg-destructive px-7 py-4",
                  destructiveItems.length > 1
                    ? index === 0 &&
                        "rounded-t-2xl border-b border-cosmosMutedText/10"
                    : "rounded-t-2xl",
                  index === items.length - 1 && "rounded-b-2xl",
                  destructiveItems.length > 1
                    ? index !== 0 &&
                        index !== items.length - 1 &&
                        "border-b border-cosmosMutedText/10"
                    : "rounded-b-2xl"
                )}
              >
                <Text className="text-lg text-destructiveText">
                  {item.text}
                </Text>
                {item.icon}
              </Pressable>
            )
          })}
      </View>
    </View>
  )
}

export default BottomSheetOptionsList
