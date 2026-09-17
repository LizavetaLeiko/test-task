import { useMutation } from '@tanstack/react-query'
import { useSessionStore } from '@/entities/session'
import {
  getStateInstance,
  GreenApiError,
  type GreenApiCredentials,
} from '@/shared/api/green-api'

export function useLogin() {
  const setSession = useSessionStore((state) => state.setSession)

  return useMutation({
    mutationFn: async (credentials: GreenApiCredentials) => {
      const response = await getStateInstance(credentials)
      if (!response) {
        throw new GreenApiError('Empty response from GREEN-API', 'parse')
      }
      if (response.stateInstance !== 'authorized') {
        throw new Error(`Instance is not authorized (state: ${response.stateInstance})`)
      }
      return { credentials, stateInstance: response.stateInstance }
    },
    onSuccess: ({ credentials, stateInstance }) => {
      setSession(credentials, stateInstance)
    },
  })
}
