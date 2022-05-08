import React, { ReactNode, useEffect, useRef, useState } from 'react'

export const TooltipContext = React.createContext<HTMLDivElement | null>(null)

const { Provider } = TooltipContext

export const TooltipProvider = ({ children }: { children: ReactNode }) => {
  const [context, setContext] = useState<HTMLDivElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setContext(tooltipRef.current)
  }, [])

  return (
    <>
      <Provider value={context}>{children}</Provider>
      <div id="tooltip-root" ref={tooltipRef}></div>
    </>
  )
}
