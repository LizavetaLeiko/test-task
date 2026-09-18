import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 bg-gray-50 p-4 text-center">
          <p className="text-lg font-semibold text-gray-800">Что-то пошло не так</p>
          <p className="text-sm text-gray-500">Попробуйте перезагрузить страницу.</p>
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Перезагрузить
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
