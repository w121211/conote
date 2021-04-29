import React from 'react'
import { QueryResult } from '@apollo/client'
/**
 * React trick - Render Props, See:
 * https://stackoverflow.com/questions/59481733/hocs-and-render-props-with-functional-components-in-react-16
 * https://reactjs.org/docs/render-props.html
 */
export function QueryDataProvider<T>({
  useQuery,
  render,
}: {
  useQuery: () => QueryResult<T>
  render: (data: T) => JSX.Element | null
}): JSX.Element {
  const { loading, data, error } = useQuery()
  if (loading) {
    return <h1>Loading</h1>
  }
  if (error) {
    return <h1>API Error: {error.message}</h1>
  }
  if (data) {
    return <>{render(data)}</>
  }
  return <h1>Unexpected error</h1>
}
