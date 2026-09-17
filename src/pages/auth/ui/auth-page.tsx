import { LoginForm } from '@/features/auth-login'

export function AuthPage() {
  return (
    <div className="flex h-full items-center justify-center bg-gray-50 p-4">
      <LoginForm />
    </div>
  )
}
