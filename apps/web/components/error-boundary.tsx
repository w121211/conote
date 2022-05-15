/**
 * References
 * - https://nextjs.org/docs/advanced-features/error-handling
 * - https://stackoverflow.com/questions/63916900/how-to-properly-type-a-react-errorboundary-class-component-in-typescript
 *
 */
import React, { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  constructor(props: Props) {
    super(props)

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false }
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return <h1>Sorry.. there was an error</h1>
      // return (
      //   <div>
      //     <h2>Oops, there is an error!</h2>
      //     <button
      //       type="button"
      //       onClick={() => this.setState({ hasError: false })}
      //     >
      //       Try again?
      //     </button>
      //   </div>
      // )
    }

    return this.props.children
  }
}

export default ErrorBoundary
