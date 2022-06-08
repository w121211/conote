import React from 'react'

export const StatusDisplay = ({
  str,
  btn,
}: {
  str: string
  btn?: JSX.Element
}): JSX.Element => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <section className="text-center mx-6 lg:w-2/3">
        <h1 className="mb-10 ">{str}</h1>
        {btn}
      </section>
    </div>
  )
}

export const ErrorDisplay = ({
  error,
  btn,
}: {
  error: string
  btn?: JSX.Element
}): JSX.Element => {
  return <StatusDisplay str={`Ooops!${error}`} btn={btn} />
}
