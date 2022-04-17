import { useMemo } from 'react'
import { parse } from '../../parse-renderer'
import InlineEl from './inline-el'

const ParseRenderEl = ({
  blockUid,
  str,
}: {
  blockUid: string
  str: string
}) => {
  const inlines = useMemo(() => parse(str), [str])

  return (
    <>
      {inlines.map((e, i) => (
        <InlineEl key={i} blockUid={blockUid} inline={e} />
      ))}
    </>
  )
}

export default ParseRenderEl
