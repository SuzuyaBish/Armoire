import { Text } from "@/components/StyledComponents"
import { Toast, useToast } from "@/components/ui/toast"

type ToastProps = {
  toast: ReturnType<typeof useToast>
  body: string
}

export const showNewToast = ({ toast, body }: ToastProps) => {
  const newId = Math.random().toString()

  if (!toast.isActive(newId)) {
    toast.show({
      id: newId,
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id
        return (
          <Toast
            nativeID={uniqueToastId}
            action="muted"
            variant="solid"
            className="rounded-full bg-white"
          >
            <Text className="text-black">{body}</Text>
          </Toast>
        )
      },
    })
  }
}
