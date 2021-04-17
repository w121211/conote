import React from 'react'

export function Link({ to, children }: { to: string; children?: React.ReactNode }): JSX.Element {
  return <>{children}</>
}
