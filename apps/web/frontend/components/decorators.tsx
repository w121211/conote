import React from 'react'

export function decorateId(id: string) {
  return (
    <span className="text-gray-400/60 font-light">{`#${id.slice(-6)}`}</span>
  )
}
