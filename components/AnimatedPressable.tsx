import { MotiPressable } from "moti/interactions"
import { FC, useMemo } from "react"

interface AnimatedPressableProps
  extends React.ComponentProps<typeof MotiPressable> {
  children: React.ReactNode
  modest?: boolean
  extraModest?: boolean
}

const AnimatedPressable: FC<AnimatedPressableProps> = ({
  children,
  modest = false,
  extraModest = false,
  ...props
}) => {
  return (
    <MotiPressable
      {...props}
      animate={useMemo(
        () =>
          ({ hovered, pressed }) => {
            "worklet"

            if (modest) {
              return {
                scale: hovered || pressed ? 0.93 : 1,
              }
            } else if (extraModest) {
              return {
                scale: hovered || pressed ? 0.99 : 1,
              }
            } else {
              return {
                scale: hovered || pressed ? 0.7 : 1,
              }
            }
          },
        []
      )}
    >
      {children}
    </MotiPressable>
  )
}

export default AnimatedPressable
