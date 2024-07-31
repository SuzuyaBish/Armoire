import { FontType } from "@/lib/types/font-types"
import { assignFontFamily, cn } from "@/lib/utils"
import { FC } from "react"
import { Text as DefaultText, View as DefaultView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface StyledText extends React.ComponentProps<typeof DefaultText> {
  family?: FontType
}

interface ParentView extends React.ComponentProps<typeof DefaultView> {
  hasPadding?: boolean
  hasInsets?: boolean
}

const Text: FC<StyledText> = ({ family = "regular", ...props }) => {
  const fontFamily = assignFontFamily(family)
  return (
    <DefaultText
      {...props}
      className={cn("text-white", props.className)}
      style={[props.style, { fontFamily }]}
    />
  )
}

const ParentView: FC<ParentView> = ({ hasInsets, hasPadding, ...props }) => {
  const insets = useSafeAreaInsets()
  return (
    <DefaultView
      {...props}
      className={cn(
        "flex flex-1 bg-bgColor",
        hasPadding && "px-2 pt-6",
        props.className
      )}
      style={[props.style, hasInsets && { paddingTop: insets.top }]}
    />
  )
}

export { ParentView, Text }
