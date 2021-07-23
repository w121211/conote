import React, { useState } from 'react'

export function useInput(props: { type: string }): [string, JSX.Element] {
  const { type } = props
  const [value, setValue] = useState('')
  const input = <input value={value} onChange={e => setValue(e.target.value)} type={type} />
  return [value, input]
}
