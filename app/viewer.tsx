import AppBar from "@/components/AppBar"
import { ParentView } from "@/components/StyledComponents"
import ImageViewer from "@/components/viewer/ImageViewer"
import { getPieceById } from "@/lib/api/pieces/queries"
import { ViewerPageProps } from "@/lib/types/viewer-page"
import { format } from "date-fns"
import { useLocalSearchParams } from "expo-router"
import React from "react"
import useSWR from "swr"

export default function ViewerPage() {
  const { id } = useLocalSearchParams() as ViewerPageProps
  const fetcher = async () => await getPieceById(id)
  const { data } = useSWR(id, fetcher)

  return (
    <ParentView hasInsets className="relative">
      {data && (
        <>
          <AppBar
            title={format(data?.piece?.createdAt!, "dd MMMM yyyy")}
            custom={false}
            hasBackButton
          />
          <ImageViewer id={id} data={data.piece!} />
        </>
      )}
    </ParentView>
  )
}
