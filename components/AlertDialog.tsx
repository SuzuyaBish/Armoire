import { DialogTypes } from "@/lib/types/dialog-types"
import { generateDialogText } from "@/lib/utils"
import { NotificationFeedbackType, notificationAsync } from "expo-haptics"
import { FC } from "react"
import { TouchableOpacity } from "react-native"
import { Text } from "./StyledComponents"
import {
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialog as AlertDialogComponent,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "./ui/alert-dialog"

interface AlertDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  type: DialogTypes
}

const AlertDialog: FC<AlertDialogProps> = ({ ...props }) => {
  const { title, body } = generateDialogText(props.type)
  return (
    <AlertDialogComponent isOpen={props.open} onClose={props.onClose} size="md">
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Text family="fancy" className="text-2xl">
            {title}
          </Text>
        </AlertDialogHeader>
        <AlertDialogBody className="mb-4 mt-3">
          <Text>{body}</Text>
        </AlertDialogBody>
        <AlertDialogFooter className="">
          <TouchableOpacity
            className="rounded-lg bg-white px-5 py-2"
            onPress={props.onClose}
          >
            <Text className="text-black">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-lg bg-destructive px-5 py-2"
            onPress={() => {
              props.onConfirm()
              notificationAsync(NotificationFeedbackType.Success)
            }}
          >
            <Text className="text-destructiveText">Delete</Text>
          </TouchableOpacity>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogComponent>
  )
}

export default AlertDialog
