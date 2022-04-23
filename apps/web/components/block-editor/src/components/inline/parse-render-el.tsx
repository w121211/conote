import { useMemo } from 'react'
import { parse } from '../../parse-renderer'
import InlineEl from './inline-el'

const ParseRenderEl = ({
  blockUid,
  str,
  className,
}: {
  blockUid: string
  str: string
  className?: string
}) => {
  const inlines = useMemo(() => parse(str), [str])

  return (
    <div className={className}>
      {inlines.map((e, i) => (
        <InlineEl
          key={i}
          // className={className}
          blockUid={blockUid}
          inline={e}
        />
      ))}
    </div>
  )
}

export default ParseRenderEl
