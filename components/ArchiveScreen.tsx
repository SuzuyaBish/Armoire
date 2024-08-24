import { getOrderedArchived } from "@/lib/api/pieces/queries"

import React from "react"
import useSWR from "swr"
import ImageList from "./ImageList"

export default function ArchiveScreen() {
  const { data, isLoading } = useSWR("archived", getOrderedArchived)
  if (data) {
    return (
      <ImageList pieces={data?.pieces} isLoading={isLoading} type="Archives" />
    )
  }
}
