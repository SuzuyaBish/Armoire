import { ParentView } from "@/components/StyledComponents"
import ImageViewer from "@/components/viewer/ImageViewer"
import VideoViewer from "@/components/viewer/VideoViewer"
import { getFileById } from "@/lib/api/files/queries"
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
    const data = await getFileById(id)

    navigation.setOptions({
      title: format(data?.file?.createdAt!, "dd MMMM yyyy"),
    })

    return data
  }
  const { data } = useSWR(id, fetcher)
  const navigation = useNavigation()

  return (
    <ParentView className="relative">
      {data && (
        <>
          {data.file?.fileType === "image" ? (
            <ImageViewer id={id} data={data.file} />
          ) : (
            <VideoViewer id={id} data={data.file!} />
          )}
        </>
      )}
    </ParentView>
  )
}
