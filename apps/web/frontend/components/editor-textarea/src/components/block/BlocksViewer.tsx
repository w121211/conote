import { treeUtil } from '@conote/docdiff'
import React from 'react'
import {
  ReactMarkdown,
  ReactMarkdownOptions,
} from 'react-markdown/lib/react-markdown'
import { blocksToIndenters } from '../../../../editor-slate/src/indenter/serializers'
import { ElementIndenter } from '../../../../editor-slate/src/interfaces'
import type { Block } from '../../interfaces'
import '../block/block-container.module.css'
import ParseRenderEl from '../inline/parse-render-el'

function buildComponents(blockUid: string) {
  const components: ReactMarkdownOptions['components'] = {
    h4: 'h3',
    h5: 'h3',
    h6: 'h3',
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
            } else {
              return e
            }
          })}
        </p>
      )
    },
    ul: ({ node, children, ...props }) => {
      const { ordered, ...rest } = props // Remove ordered prop to settle the React.js warning
      return (
        <ul {...rest} className="list-disc">
          {children}
        </ul>
      )
    },
    li: ({ node, children, ...props }) => {
      const { ordered, ...rest } = props // Remove ordered prop to settle the React.js warning
      return (
        <li {...rest}>
          <p>{children}</p>
        </li>
      )
    },
  }
  return components
}

const Indenter = ({ indenter }: { indenter: ElementIndenter }) => {
  const { blockCopy, indent } = indenter

  if (blockCopy === undefined) throw new Error('blockCopy === undefined')

  const { uid, str } = blockCopy,
    // marginLeft = indent >= 3 ? 6 * (indent - 3) : 0 // pixel
    marginLeft = 24 * indent

  return (
    <div
    // style={{ marginLeft }}
    // className="relative rounded-lg leading-relaxed"
    >
      {str === '' ? (
        <span className="text-gray-400">...</span>
      ) : (
        // <ReactMarkdown>{str}</ReactMarkdown>
        <ReactMarkdown components={buildComponents(uid)} className="markdown">
          {str}
        </ReactMarkdown>
        // <div>{str}</div>
      )}
    </div>
  )
}

/**
 * Assume input blocks are sorted in depth-first order
 *
 */
const BlocksViewer = ({
  blocks,
}: {
  blocks: Omit<Block, 'childrenUids'>[]
}) => {
  const [root, ...rest] = blocksToIndenters(blocks)
  // const nodes = treeUtil.toTreeNodeBodyList(blocks)
  // const root = treeUtil.buildFromList(nodes)

  // const s = rest
  //   .map(
  //     ({ blockCopy, indent }) =>
  //       '&nbsp;&nbsp;'.repeat(indent) + blockCopy?.str ?? '',
  //   )
  //   .join('\n\n')
  const s = rest
    .map(({ blockCopy, indent }) => {
      if (blockCopy && blockCopy.str.length > 0) {
        return blockCopy.str
      }
      return '...'
    })
    .join('\n\n\n')
  // console.log(s)

  return (
    <ReactMarkdown components={buildComponents('uid')} className="markdown">
      {s}
    </ReactMarkdown>
  )

  return (
    <>
      {rest.map(e => (
        <Indenter key={e.uid} indenter={e} />
      ))}
    </>
  )
}

export default BlocksViewer
