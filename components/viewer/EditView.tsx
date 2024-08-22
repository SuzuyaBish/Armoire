import { defaultTags } from "@/constants/default_tags"
import { updatePiece } from "@/lib/api/pieces/mutations"
import { Piece, UpdatePieceParams } from "@/lib/db/schema/pieces"
import { NotificationFeedbackType, notificationAsync } from "expo-haptics"
import {
  ArchiveIcon,
  HeartCrackIcon,
  HeartIcon,
  TagsIcon,
  TrashIcon,
} from "lucide-react-native"
import { FC, useState } from "react"
import { Pressable, ScrollView, View } from "react-native"
import Animated, {
  Easing,
  FadeIn,
  LinearTransition,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"
import { useSWRConfig } from "swr"
import ImageSaver from "../ImageSaver"
import SheetMenuItem from "../SheetMenuItem"
import { Text } from "../StyledComponents"

interface EditViewProps extends Piece {
  close: (isDeleting: boolean) => void
  editing: (isEditing: boolean) => void
}

const EditView: FC<EditViewProps> = ({ close, editing, ...props }) => {
  const { mutate } = useSWRConfig()

  const [isEditingTags, setIsEditingTags] = useState(false)

  const SheetContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: isEditingTags
            ? 0.8
            : withTiming(1, {
                duration: 300,
                easing: Easing.inOut(Easing.cubic),
              }),
        },
      ],
    }
  })
  const TagsContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: isEditingTags
            ? withTiming(1, {
                duration: 300,
                easing: Easing.inOut(Easing.cubic),
              })
            : withTiming(0.8, {
                duration: 300,
                easing: Easing.inOut(Easing.cubic),
              }),
        },
      ],
    }
  })

  return (
    <Animated.View className="flex-1">
      <View className="gap-y-4">
        {isEditingTags ? (
          <Animated.View style={TagsContainerStyle}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-3 flex flex-row flex-wrap gap-3">
                {defaultTags.map((tag, index) => {
                  return (
                    <Pressable key={tag}>
                      <Animated.View
                        layout={LinearTransition}
                        entering={FadeIn.delay(index * 20)}
                        className="rounded-full border border-muted px-3 py-2"
                      >
                        <Text>{tag}</Text>
                      </Animated.View>
                    </Pressable>
                  )
                })}
              </View>
            </ScrollView>
          </Animated.View>
        ) : (
          <Animated.View style={SheetContainerStyle} className="gap-y-4">
            <SheetMenuItem
              title="Edit Tags"
              icon={<TagsIcon color="#494849" size={18} />}
              onPress={() => {
                editing(true)
                setIsEditingTags(true)
              }}
            />
            <SheetMenuItem
              title={props.favorited ? "Unfavorite Photo" : "Favorite Photo"}
              icon={
                props.favorited ? (
                  <HeartCrackIcon color="#494849" size={18} />
                ) : (
                  <HeartIcon color="#494849" size={18} />
                )
              }
              onPress={async () => {
                const updatedPiece: UpdatePieceParams = {
                  id: props.id!,
                  tags: props.tags,
                  archived: props.archived!,
                  filePath: props.filePath,
                  aspect_ratio: props.aspect_ratio!,
                  collections: props.collections,
                  favorited: !props.favorited,
                }

                await updatePiece(props.id!, updatedPiece)
                mutate(props.id)
                mutate("pieces")
                notificationAsync(NotificationFeedbackType.Success)
                close(false)
              }}
            />
            <SheetMenuItem
              title={props.archived ? "Unarchive Photo" : "Archive Photo"}
              icon={<ArchiveIcon color="#494849" size={18} />}
              onPress={async () => {
                const updatedPiece: UpdatePieceParams = {
                  id: props.id!,
                  tags: props.tags,
                  archived: !props.archived,
                  filePath: props.filePath,
                  aspect_ratio: props.aspect_ratio!,
                  collections: props.collections,
                  favorited: props.favorited,
                }

                await updatePiece(props.id!, updatedPiece)
                mutate(props.id)
                mutate("pieces")
                mutate("archived")
                close(false)

                notificationAsync(NotificationFeedbackType.Success)
              }}
            />
            <ImageSaver {...props} close={() => {}} />
            <SheetMenuItem
              isDestructive
              title="Delete Photo"
              icon={<TrashIcon color="#FF58AE" size={18} />}
              onPress={async () => {
                close(true)
              }}
            />
          </Animated.View>
        )}
      </View>
    </Animated.View>
  )
}

export default EditView
