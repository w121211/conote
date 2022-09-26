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
  const parsed = useMemo(() => parseBlockString(str), [str])
  const { inlineItems } = parsed

  return (
    <span className={className}>
      {inlineItems.map((e, i) => (
        <InlineEl
          key={i}
          blockUid={blockUid}
          inlineItem={e}
          isViewer={isViewer}
        />
      ))}
    </span>
  )
}

export default ParseRenderEl
