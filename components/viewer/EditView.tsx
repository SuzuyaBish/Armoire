import { updatePiece } from "@/lib/api/pieces/mutations"
import { getTags } from "@/lib/api/tags/queries"
import { Piece, UpdatePieceParams } from "@/lib/db/schema/pieces"
import { Tag } from "@/lib/db/schema/tags"
import { cn, removeTagFromArray, tagInTagArray } from "@/lib/utils"
import { AnimatePresence } from "@legendapp/motion"
import { NotificationFeedbackType, notificationAsync } from "expo-haptics"
import {
  ArchiveIcon,
  CheckIcon,
  HeartCrackIcon,
  HeartIcon,
  TagsIcon,
  TrashIcon,
} from "lucide-react-native"
import { MotiView } from "moti"
import { FC, useState } from "react"
import { Pressable, ScrollView, View } from "react-native"
import Animated, {
  Easing,
  FadeIn,
  LinearTransition,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"
import useSWR, { useSWRConfig } from "swr"
import ImageSaver from "../ImageSaver"
import SheetMenuItem from "../SheetMenuItem"
import { Text } from "../StyledComponents"

interface EditViewProps extends Piece {
  close: (isDeleting: boolean) => void
  setIsEditing: (isEditing: boolean) => void
  isEditing: boolean
}

const EditView: FC<EditViewProps> = ({
  close,
  setIsEditing,
  isEditing,
  ...props
}) => {
  const { mutate } = useSWRConfig()
  const { data: tags, mutate: tagsMutate } = useSWR("tags", getTags)

  const [selectedTags, setSelectedTags] = useState<Tag[] | null>(
    JSON.parse(props?.tags || "[]")
  )

  const SheetContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: isEditing
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
          scale: isEditing
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
        {isEditing ? (
          <Animated.View style={TagsContainerStyle}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-3 flex flex-row flex-wrap gap-3">
                {tags?.tags.map((tag, index) => {
                  return (
                    <Pressable
                      key={tag.id}
                      onPress={() => {
                        if (tagInTagArray(tag.id, selectedTags || [])) {
                          setSelectedTags(
                            removeTagFromArray(tag.id, selectedTags || [])
                          )
                        } else {
                          setSelectedTags([...(selectedTags || []), tag])
                        }
                      }}
                    >
                      <Animated.View
                        layout={LinearTransition}
                        entering={FadeIn.delay(index * 20)}
                        className={cn(
                          "flex flex-row items-center gap-x-2 rounded-full border px-3 py-2",
                          tagInTagArray(tag.id, selectedTags || [])
                            ? "border-greenColor/50 bg-greenColor/5"
                            : "border-muted"
                        )}
                      >
                        <Text
                          className={cn(
                            tagInTagArray(tag.id, selectedTags || [])
                              ? "text-greenColor"
                              : "text-accent"
                          )}
                        >
                          {tag.title}
                        </Text>
                        <AnimatePresence>
                          {tagInTagArray(tag.id, selectedTags || []) && (
                            <MotiView className="rounded-full border border-greenColor/50 bg-greenColor/10 p-1">
                              <CheckIcon color="#00CB48" size={10} />
                            </MotiView>
                          )}
                        </AnimatePresence>
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
                setIsEditing(true)
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
