import { filesUrl } from "@/constants/files"
import {
  copyAsync,
  deleteAsync,
  getInfoAsync,
  makeDirectoryAsync,
  readDirectoryAsync,
} from "expo-file-system"
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from "expo-media-library"

export async function createFilesPath() {
  const urlInfo = await getInfoAsync(filesUrl)

  if (urlInfo.exists) {
    return urlInfo
  } else {
    await makeDirectoryAsync(filesUrl)
    return await getInfoAsync(filesUrl)
  }
}

export async function copyToFilesPath(uri: string) {
  const path = await createFilesPath()

  await copyAsync({
    from: uri,
    to: path.uri + "/" + uri.split("/").pop(),
  })
}

export async function readDir() {
  return await readDirectoryAsync(filesUrl)
}

export const renderFromFileSystem = async () => {
  const files = await readDirectoryAsync(filesUrl)
  const uris = []

  for (let file of files) {
    const info = await getInfoAsync(filesUrl + file)
    uris.push(info.uri)
  }

  return uris
}

export const deleteFromFilesPath = async (uri: string) => {
  await deleteAsync(uri)
}

export const getPermissions = async () => {
  const permissions = await getPermissionsAsync()

  if (permissions.granted) {
    return true
  }

  return requestPermissionsAsync()
}
