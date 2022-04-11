import { useMemo } from 'react'
import { parse } from '../../parse-renderer'
import InlineEl from './inline-el'

const ParseRenderEl = ({ str }: { str: string }) => {
  const inlines = useMemo(() => parse(str), [str])

  return (
    <>
      {inlines.map((e, i) => (
        <InlineEl key={i} inline={e} />
      ))}
    </>
  )
}

export default ParseRenderEl
