import AlertDialog from "@/components/AlertDialog"
import AppBar from "@/components/AppBar"
import ImageSaverMenuItem from "@/components/ImageSaverMenuItem"
import MenuItem from "@/components/MenuItem"
import { ParentView, Text } from "@/components/StyledComponents"
import { Switch } from "@/components/ui/switch"
import { deletePiece, updatePiece } from "@/lib/api/pieces/mutations"
import { getPieceById } from "@/lib/api/pieces/queries"
import { Piece } from "@/lib/db/schema/pieces"
import { ViewerPageProps } from "@/lib/types/viewer-page"
import { Image } from "expo-image"
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useState } from "react"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useSWR, { useSWRConfig } from "swr"

export default function EditorScreen() {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams() as ViewerPageProps
  const fetcher = async () => {
    const data = await getPieceById(id)
    setPiece(data.piece)
    return data
  }
  const { data, mutate: currentPieceMutate } = useSWR(id, fetcher)

  const [piece, setPiece] = useState<Piece>()
  const [dialogOpen, setDialogOpen] = useState(false)

  const green = "#7FA45A"

  const showActions = () => {
    const cond1 = piece?.favorited !== data?.piece?.favorited
    const cond2 = piece?.archived !== data?.piece?.archived
    const cond3 = piece?.tags !== data?.piece?.tags

    return cond1 || cond2 || cond3
  }

  return (
    <ParentView
      hasInsets
      className="pt-6"
      style={{
        paddingBottom: insets.bottom,
      }}
    >
      <AppBar
        custom={false}
        title="Edit Photo"
        hasBackButton
        actionOnPress={async () => {
          await updatePiece(piece!.id, {
            ...piece!,
            tags: piece!.tags,
            favorited: piece!.favorited,
            archived: piece!.archived!,
          })
          currentPieceMutate()
          mutate("pieces")
          mutate("collections")
        }}
        action={<>{showActions() && <Text>Done</Text>}</>}
      />
      <View className="flex-1">
        {piece && (
          <View className="gap-y-7">
            <View className="flex items-center">
              <Image
                source={{ uri: piece.filePath }}
                contentFit="cover"
                contentPosition="center"
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 10,
                }}
              />
            </View>
            <View className="">
              <MenuItem
                title="Favorite Photo"
                description="Mark this photo as one of your favorits"
                border="both"
                rightItem={
                  <Switch
                    value={piece.favorited!}
                    trackColor={{
                      true: green,
                      false: "#1D1D1D",
                    }}
                    onChange={(e) => {
                      setPiece({ ...piece, favorited: e.nativeEvent.value })
                    }}
                  />
                }
              />
              <MenuItem
                title="Archive Photo"
                description="Mark this photo as archived"
                border="bottom"
                rightItem={
                  <Switch
                    value={piece.archived!}
                    trackColor={{
                      true: green,
                      false: "#1D1D1D",
                    }}
                    onChange={(e) => {
                      setPiece({ ...piece, archived: e.nativeEvent.value })
                    }}
                  />
                }
              />

              <MenuItem
                title="Edit Tags"
                description="Add or remove tags to this photo"
                border="bottom"
                onPress={() =>
                  router.push({
                    pathname: "/(editor)/tags",
                    params: { id: piece.id },
                  })
                }
              />
              <ImageSaverMenuItem filePath={piece.filePath} />
              <MenuItem
                title="Delete Photo"
                description="This action cannot be undone"
                border="none"
                onPress={() => setDialogOpen(true)}
              />
              <AlertDialog
                type="delete"
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={async () => {
                  await deletePiece(piece.id)
                  mutate("pieces")
                  mutate("collections")
                  setDialogOpen(false)
                  router.dismissAll()
                }}
              />
            </View>
          </View>
        )}
      </View>
    </ParentView>
  )
}
