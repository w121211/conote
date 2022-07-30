import { useObservable } from '@ngneat/react-rxjs'
import { isNil } from 'lodash'
import React, { useCallback, useState } from 'react'
import Link from 'next/link'
import { getNotePageURL } from '../../../../../utils'
import SearcherModal from '../../../../search-all-modal/searcher-modal'
import { editorChainItemInsert } from '../../events'
import { docRepo } from '../../stores/doc.repository'
import { editorRepo } from '../../stores/editor.repository'
import DocEl from '../doc/doc-el'
import { SearcherProps } from '../../../../../interfaces'

const ChainItemInsertButton = ({
  afterThisDraftId,
}: {
  afterThisDraftId: string
}): JSX.Element => {
  const [loading, setLoading] = useState(false)

  async function insert(symbol: string) {
    setLoading(true)
    await editorChainItemInsert(symbol, afterThisDraftId)
    setLoading(false)
  }

  const searcher: SearcherProps['searcher'] = {
    searchRange: 'symbol',
    onClickSymbolCreate: symbol => insert(symbol),
    onClickHit: hit => insert(hit.str),
  }

  if (loading) {
    return <div>Loading</div>
  }
  return <SearcherModal searcher={searcher} />
}

const ChainDoc = ({
  docUid,
  scrollToThis,
}: {
  docUid: string
  scrollToThis?: boolean
}) => {
  const [doc] = useObservable(docRepo.getDoc$(docUid), {
    initialValue: null,
  })

  // Use useCallback instead of useRef, https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const ref = useCallback(
    (node: HTMLElement) => {
      if (node !== null) {
        if (scrollToThis) {
          node.scrollIntoView()
        }
      }
    },
    [scrollToThis],
  )

  if (isNil(doc)) {
    return <div>Loading</div>
  }
  return (
    <div>
      {doc && (
        <div>
          <button>View</button>
          {doc.noteCopy && (
            <Link href={getNotePageURL(doc.noteCopy.sym.symbol)}>
              <a>View current head note</a>
            </Link>
          )}
        </div>
      )}
      {/* <DocEl doc={doc} /> */}
      <DocEl doc={doc} ref={ref} />
    </div>
  )
}

export const EditorChainEl = (): JSX.Element | null => {
  const [tab] = useObservable(editorRepo.tab$)
  // [alert] = useObservable(editorRepo.alter$),

  if (tab.curChain.length === 0) {
    return null
  }
  return (
    <div>
      {/* {alert && <div>{alert.message}</div>} */}
      {tab.curChain.map((e, i) => {
        const isFocus = e.entry.id === tab.curChainItem?.draftId,
          isInSameChain =
            isFocus &&
            tab.curChain.find(
              a => a.entry.id === tab.prevChainItem?.draftId,
            ) !== undefined,
          scrollToThis =
            (i === 0 && isFocus && isInSameChain) || (i > 0 && isFocus)

        return (
          <div key={e.docUid}>
            <ChainDoc docUid={e.docUid} scrollToThis={scrollToThis} />
            <ChainItemInsertButton afterThisDraftId={e.entry.id} />
          </div>
        )
      })}
      <button
        onClick={() => {
          // if (div.current) {
          //   // div.current.scrollIntoView()
          //   div.current.scrollTo({ top: -1000 })
          // }
          const el = document.getElementById('layout-children-container')
          if (el) {
            el.scrollTo({ top: 0 })
          }

          // console.log(body)
        }}
      >
        Top
      </button>
    </div>
  )
}
