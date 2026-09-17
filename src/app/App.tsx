import { QueryProvider } from './providers/query-provider'

export function App() {
  return (
    <QueryProvider>
      <div className="flex h-full items-center justify-center bg-gray-50 text-gray-700">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">MAX Chat</h1>
        </div>
      </div>
    </QueryProvider>
  )
}
