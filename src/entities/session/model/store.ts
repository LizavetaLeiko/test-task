import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GreenApiCredentials, InstanceState } from '@/shared/api/green-api'

interface SessionState {
  credentials: GreenApiCredentials | null
  instanceState: InstanceState | null
  setSession: (credentials: GreenApiCredentials, instanceState: InstanceState) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      credentials: null,
      instanceState: null,
      setSession: (credentials, instanceState) => set({ credentials, instanceState }),
      clearSession: () => set({ credentials: null, instanceState: null }),
    }),
    { name: 'max-chat-session' },
  ),
)
