import type { InputHTMLAttributes } from 'react'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function TextInput({ label, id, className = '', ...props }: TextInputProps) {
  return (
    <label className="flex flex-col gap-1 text-sm" htmlFor={id}>
      {label && <span className="font-medium text-gray-700">{label}</span>}
      <input
        id={id}
        className={`rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${className}`}
        {...props}
      />
    </label>
  )
}
