import { useMutation } from '@tanstack/react-query'
import { useChatStore } from '@/entities/chat'
import { useSessionStore } from '@/entities/session'
import { sendMessage } from '@/shared/api/green-api'

interface SendMessageVars {
  chatId: string
  text: string
}

interface SendMessageContext {
  tempId: string
}

export function useSendMessage() {
  const credentials = useSessionStore((state) => state.credentials)
  const addMessage = useChatStore((state) => state.addMessage)
  const updateMessage = useChatStore((state) => state.updateMessage)

  return useMutation<
    { idMessage: string } | null,
    Error,
    SendMessageVars,
    SendMessageContext
  >({
    mutationFn: ({ chatId, text }) => {
      if (!credentials) throw new Error('No active session')
      return sendMessage(credentials, { chatId, message: text })
    },
    onMutate: ({ chatId, text }) => {
      const tempId = crypto.randomUUID()
      addMessage({
        id: tempId,
        chatId,
        text,
        direction: 'outgoing',
        timestamp: Date.now(),
        status: 'pending',
      })
      return { tempId }
    },
    onSuccess: (_data, _vars, context) => {
      updateMessage(context.tempId, { status: 'sent' })
    },
    onError: (_error, _vars, context) => {
      if (context) updateMessage(context.tempId, { status: 'failed' })
    },
  })
}
