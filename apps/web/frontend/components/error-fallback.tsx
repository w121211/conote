import { FallbackProps } from 'react-error-boundary'

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
      <a href="/">Go to Home</a>
    </div>
  )
}

export default ErrorFallback
