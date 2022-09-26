import { fromMarkdown } from 'mdast-util-from-markdown'
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
  function parseRender(
    children: (React.ReactNode & React.ReactNode[]) | undefined,
  ) {
    if (Array.isArray(children)) {
      return children.map((e, i) => {
        if (typeof e === 'string') {
          return (
            <span key={i}>
              <ParseRenderEl key={i} blockUid={blockUid} str={e} isViewer />
            </span>
          )
        } else {
          return e
        }
      })
    }
    return children
  }

  const components: ReactMarkdownOptions['components'] = {
    h4: 'h3',
    h5: 'h3',
    h6: 'h3',
    h1: ({ node, children, ...props }) => {
      return <h1 {...props}>{parseRender(children)}</h1>
    },
    h2: ({ node, children, ...props }) => {
      return <h2 {...props}>{parseRender(children)}</h2>
    },
    h3: ({ node, children, ...props }) => {
      return <h3 {...props}>{parseRender(children)}</h3>
    },
    p: ({ node, children, ...props }) => {
      return <p {...props}>{parseRender(children)}</p>
    },
    // ul: ({ node, children, ...props }) => {
    //   const { ordered, ...rest } = props // Remove ordered prop to settle the React.js warning
    //   return (
    //     <ul {...rest} className="list-disc">
    //       {children}
    //     </ul>
    //   )
    // },
    li: ({ node, children, ...props }) => {
      const { ordered, ...rest } = props // Remove ordered prop to settle the React.js warning
      console.log(children)
      return <li {...rest}>{parseRender(children)}</li>
    },
  }
  return components
}

const Indenter = ({ indenter }: { indenter: ElementIndenter }) => {
  const { blockCopy, indent } = indenter

  if (blockCopy === undefined) throw new Error('blockCopy === undefined')

  const { uid, str } = blockCopy
  // marginLeft = indent >= 3 ? 6 * (indent - 3) : 0 // pixel
  const marginLeft = 24 * indent

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
 * In-place set each indenter's markdown indent
 *
 */
function setMarkdownIndent_(indenters: ElementIndenter[]) {
  for (let i = 0; i < indenters.length; i++) {
    const cur = indenters[i]

    // Get parent of current indenter by reverse search the indent that smaller than current
    let parent: ElementIndenter | null = null
    for (let j = i - 1; j >= 0; j--) {
      const prev = indenters[j]
      if (prev.indent < cur.indent) {
        parent = prev
        break
      }
    }

    const tree = fromMarkdown(cur.blockCopy?.str ?? '')
    if (tree.children.length > 0 && tree.children[0].type === 'heading') {
      cur.markdownIndent = -1
    } else if (parent === null) {
      cur.markdownIndent = 0
    } else {
      cur.markdownIndent = (parent.markdownIndent ?? 0) + 1
    }
  }
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

  setMarkdownIndent_(rest)

  console.log(rest)

  const lines: string[] = rest.map(e => {
    // const line =
    //   e.blockCopy?.str && e.blockCopy.str.length > 0 ? e.blockCopy.str : '...'
    const line = e.blockCopy?.str ?? ''

    if (e.markdownIndent !== undefined) {
      if (e.markdownIndent > 0) {
        return '  '.repeat(e.markdownIndent - 1) + '* ' + line
      }
      if (e.markdownIndent <= 0) {
        return '\n' + line
      }
      return line
    } else {
      throw new Error('markdownIndent not found')
    }
  })
  const text = lines.join('\n')

  console.debug(text)

  return (
    <ReactMarkdown components={buildComponents('uid')} className="markdown">
      {text}
    </ReactMarkdown>
  )
  // return (
  //   <>
  //     {rest.map(e => (
  //       <Indenter key={e.uid} indenter={e} />
  //     ))}
  //   </>
  // )
}

export default BlocksViewer
