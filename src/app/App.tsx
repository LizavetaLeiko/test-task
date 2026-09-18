import { lazy, Suspense } from 'react'
import { useSessionStore } from '@/entities/session'
import { ErrorBoundary } from './providers/error-boundary'
import { QueryProvider } from './providers/query-provider'

const AuthPage = lazy(() =>
  import('@/pages/auth').then((module) => ({ default: module.AuthPage })),
)
const ChatPage = lazy(() =>
  import('@/pages/chat').then((module) => ({ default: module.ChatPage })),
)

function Fallback() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-gray-400">
      Загрузка…
    </div>
  )
}

function Root() {
  const credentials = useSessionStore((state) => state.credentials)
  return (
    <Suspense fallback={<Fallback />}>
      {credentials ? <ChatPage /> : <AuthPage />}
    </Suspense>
  )
}

export function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <Root />
      </QueryProvider>
    </ErrorBoundary>
  )
}
