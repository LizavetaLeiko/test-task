import { useMutation } from '@tanstack/react-query'
import { useChatStore } from '@/entities/chat'
import type { Message } from '@/entities/message'
import { useSessionStore } from '@/entities/session'
import { sendMessage } from '@/shared/api/green-api'

export function useResendMessage() {
  const credentials = useSessionStore((state) => state.credentials)
  const updateMessage = useChatStore((state) => state.updateMessage)

  return useMutation<{ idMessage: string } | null, Error, Message>({
    mutationFn: (message) => {
      if (!credentials) throw new Error('No active session')
      return sendMessage(credentials, { chatId: message.chatId, message: message.text })
    },
    onMutate: (message) => {
      updateMessage(message.id, { status: 'pending' })
    },
    onSuccess: (_data, message) => {
      updateMessage(message.id, { status: 'sent' })
    },
    onError: (_error, message) => {
      updateMessage(message.id, { status: 'failed' })
    },
  })
}
