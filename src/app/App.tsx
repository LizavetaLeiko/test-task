import { useSessionStore } from '@/entities/session'
import { AuthPage } from '@/pages/auth'
import { ChatPage } from '@/pages/chat'
import { QueryProvider } from './providers/query-provider'

function Root() {
  const credentials = useSessionStore((state) => state.credentials)
  return credentials ? <ChatPage /> : <AuthPage />
}

export function App() {
  return (
    <QueryProvider>
      <Root />
    </QueryProvider>
  )
}
