import { useMemo } from 'react'
import { parse } from '../../parse-render'
import InlineEl from './inline-el'

const ParseRenderEl = ({
  blockUid,
  str,
  className,
  isViewer,
}: {
  blockUid: string
  str: string
  className?: string
  isViewer?: true
}) => {
  const inlines = useMemo(() => parse(str), [str])
  return (
    <div className={className}>
      {inlines.map((e, i) => (
        <InlineEl key={i} blockUid={blockUid} inline={e} isViewer={isViewer} />
      ))}
    </div>
  )
}

export default ParseRenderEl
