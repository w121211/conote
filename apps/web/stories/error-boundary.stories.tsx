import React, { useEffect } from 'react'
import { ComponentMeta } from '@storybook/react'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import { editorRouteUpdate } from '../frontend/components/block-editor/src/events'
import ErrorFallback from '../frontend/components/error-fallback'
import { EditorEl } from '../frontend/components/block-editor/src/components/editor/editor-el'

const ErrorDemo = () => {
  const handleError = useErrorHandler()

  useEffect(() => {
    editorRouteUpdate({ mainSymbol: 'https://storybook.js.org/' }).catch(
      // err => {
      //   console.log(err)
      // },
      handleError,
    )
  }, [])

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <EditorEl />
    </ErrorBoundary>
  )
}

export default {
  title: 'Components/ErrorBoundary',
  component: ErrorDemo,
} as ComponentMeta<typeof ErrorDemo>

export const Demo = () => <ErrorDemo />

/**
 * The 'https://storybook.js.org/' draft  is an intentional error data
 */
// export const QueryReturnError = () => {
//   const handleError = useErrorHandler()

//   useEffect(() => {
//     editorRouteUpdate({ mainSymbol: 'https://storybook.js.org/' }).catch(
//       handleError,
//     )
//   }, [])

//   return (
//     <ErrorBoundary FallbackComponent={ErrorFallback}>
//       <EditorEl />
//     </ErrorBoundary>
//   )
// }
