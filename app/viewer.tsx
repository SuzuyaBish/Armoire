import { ParentView } from "@/components/StyledComponents"
import ImageViewer from "@/components/viewer/ImageViewer"
import { getPieceById } from "@/lib/api/pieces/queries"
import { format } from "date-fns"
import { useLocalSearchParams, useNavigation } from "expo-router"
import React from "react"
import useSWR from "swr"

type ViewerPageProps = {
  id: string
}

export default function ViewerPage() {
  const { id } = useLocalSearchParams() as ViewerPageProps
  const fetcher = async () => {
    const data = await getPieceById(id)

    navigation.setOptions({
      title: format(data?.piece?.createdAt!, "dd MMMM yyyy"),
    })

    return data
  }
  const { data } = useSWR(id, fetcher)
  const navigation = useNavigation()

  return (
    <ParentView className="relative">
      {data && <ImageViewer id={id} data={data.piece!} />}
    </ParentView>
  )
}
