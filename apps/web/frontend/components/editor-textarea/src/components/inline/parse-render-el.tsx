import { useMemo } from 'react'
import { parseBlockString } from '../../parse-render'
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
  const inlines = useMemo(() => parseBlockString(str), [str]),
    { inlineItems } = inlines
  return (
    <span className={className}>
      {inlineItems.map((e, i) => (
        <InlineEl key={i} blockUid={blockUid} inline={e} isViewer={isViewer} />
      ))}
    </span>
  )
}

export default ParseRenderEl
