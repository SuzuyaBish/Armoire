import { piecesUrl } from "@/constants/pieces"
import { getInfoAsync, makeDirectoryAsync } from "expo-file-system"

export async function createPiecesPath() {
  const urlInfo = await getInfoAsync(piecesUrl)

  if (urlInfo.exists) {
    return urlInfo
  } else {
    await makeDirectoryAsync(piecesUrl)
    return await getInfoAsync(piecesUrl)
  }
}
