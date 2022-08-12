import React from 'react'

export const StatusDisplay = ({
  str,
  children,
}: {
  str: string
  children?: React.ReactNode
}) => {
  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <div className="text-center">
          <h1 className="mb-10">{str}</h1>
          {children}
        </div>
      </div>
    </div>
  )
}

export const ErrorDisplay = ({
  error,
  children,
}: {
  error: string
  children?: React.ReactNode
}) => {
  return <StatusDisplay str={`Ooops!${error}`}>{children}</StatusDisplay>
}
