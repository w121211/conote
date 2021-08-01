import React, { useEffect, useRef, useState } from 'react'

export function useInput(props: {
  type: string
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>, value?: string) => void
}): [string, JSX.Element] {
  const { type, onKeyDown } = props
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const input = (
    <input
      ref={inputRef}
      type={type}
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={event => {
        if (onKeyDown) onKeyDown(event, value)
      }}
    />
  )
  return [value, input]
}
