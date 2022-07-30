import React, { useMemo } from 'react'
import {
  ReactMarkdown,
  ReactMarkdownOptions,
} from 'react-markdown/lib/react-markdown'
import type { Block } from '../../interfaces'
import '../block/block-container.module.css'
import ParseRenderEl from '../inline/parse-render-el'

function getComponents(blockUid: string) {
  const components: ReactMarkdownOptions['components'] = {
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

const BlockViewerContent = ({
  uid,
  str,
}: {
  uid: string
  str: string
}): JSX.Element => {
  return (
    <div
      className={`[grid-area:content]
        grid [grid-template-areas:'main']
        place-items-stretch place-content-stretch
        relative z-[2]
        overflow-visible
        flex-grow
        [word-break:break-word]
        leading-[inherit]
        text-gray-700`}
    >
      <ReactMarkdown components={getComponents(uid)}>{str}</ReactMarkdown>

      {/* <ParseRenderEl
        className={`
          [grid-area:main]
          text-inherit
          font-[inherit]
          cursor-text 
          whitespace-pre-wrap [word-break:break-word]`}
        blockUid={uid}
        str={str}
        isViewer
      /> */}
    </div>
  )
}

/**
 *
 *
 */
const BlockViewer = ({
  uid,
  blocks,
  isChild,
  omitParent,
}: {
  uid: string
  blocks: Block[]
  isChild?: true
  omitParent?: true
}): JSX.Element | null => {
  const block = blocks.find(e => e.uid === uid)

  if (block === undefined) throw new Error('block === undefined')

  const children = blocks.filter(e => e.parentUid === block.uid),
    childrenBlocks = useMemo(
      () =>
        children.map(e => (
          <BlockViewer key={e.uid} uid={e.uid} blocks={blocks} isChild />
        )),
      [children],
    )
  const isOpen = true

  return (
    <div
      data-uid={uid}
      data-childrenuids={children.map(e => e.uid).join(',')}
      className={`block-container 
        ${isChild ? 'ml-[1em] [grid-area:body]' : ''}
        ${children.length > 0 && isOpen && 'show-tree-indicator'}
        ${isOpen ? 'is-open' : 'is-closed'}
        `}
    >
      {!omitParent && (
        <div
          className='
          relative
          grid [grid-template-areas:"above_above"_"content_refs"_"below_below"]
          grid-cols-[1fr_auto]
          grid-rows-[0_1fr_0]
          rounded-lg
          leading-relaxed'
        >
          <BlockViewerContent uid={block.uid} str={block.str} />
        </div>
      )}

      {isOpen && childrenBlocks}
    </div>
  )
}

export default BlockViewer
