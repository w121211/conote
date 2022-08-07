import React from 'react'
import {
  ReactMarkdown,
  ReactMarkdownOptions,
} from 'react-markdown/lib/react-markdown'
import type { Block } from '../../interfaces'
import '../block/block-container.module.css'
import ParseRenderEl from '../inline/parse-render-el'

function getComponents(blockUid: string) {
  const components: ReactMarkdownOptions['components'] = {
    h1: 'h2',
    h2: 'h3',
    p: ({ node, children, ...props }) => {
      return (
        <p {...props}>
          {children.map((e, i) => {
            if (typeof e === 'string') {
              return (
                <span key={i}>
                  <ParseRenderEl key={i} blockUid={blockUid} str={e} isViewer />
                </span>
              )
            } else return e
          })}
        </p>
      )
    },
  }
  return components
}

/**
 * Assume input blocks are sorted in depth-first order
 *
 */
const BlocksViewer = ({ blocks }: { blocks: Block[] }): JSX.Element | null => {
  return (
    <>
      {blocks.map(({ uid, str }) => (
        <div key={uid} className="relative rounded-lg leading-relaxed">
          <div
            className={`
        place-items-stretch place-content-stretch
        relative z-[2]
        overflow-visible
        flex-grow
        [word-break:break-word]
        leading-[inherit]
        text-gray-700`}
          >
            <ReactMarkdown components={getComponents(uid)}>{str}</ReactMarkdown>
          </div>
        </div>
      ))}
    </>
  )
}

export default BlocksViewer
