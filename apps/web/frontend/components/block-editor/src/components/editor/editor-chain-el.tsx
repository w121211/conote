import { useObservable } from '@ngneat/react-rxjs'
import { isNil } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useUpdateEffect } from 'react-use'
import SearcherModalButton from '../../../../search-all-modal/searcher-modal-button'
import { SearcherProps } from '../../../../../stores/searcher.repository'
import { editorChainItemInsert } from '../../events'
import { docRepo } from '../../stores/doc.repository'
import { editorRepo } from '../../stores/editor.repository'
import DocEl from '../doc/doc-el'

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
  return <SearcherModalButton searcher={searcher} />
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
      <DocEl doc={doc} ref={ref} />
    </div>
  )
}

export const EditorChainEl = (): JSX.Element | null => {
  const [tab] = useObservable(editorRepo.tab$, {
    initialValue: { openDraftId: null, chain: [], loading: true },
  })

  // const ref = useRef<HTMLDivElement>(null)
  // [alert] = useObservable(editorRepo.alter$),

  // useEffect(() => {
  //   console.log(ref)
  //   console.log(tab.chain)
  //   if (ref.current === null || !document) {
  //     return
  //   }
  //   if (location.hash.length === 0) {
  //     return
  //   }
  //   if (ref.current) {
  //     console.log('scrollIntoView')
  //     ref.current.scrollIntoView()
  //   }
  // })

  if (tab.chain.length === 0) {
    // return <div>chainDocs?.length === 0</div>
    return null
  }
  return (
    <div>
      {/* {alert && <div>{alert.message}</div>} */}
      {tab.chain.map((e, i) => (
        <div key={e.docUid}>
          <ChainDoc
            docUid={e.docUid}
            scrollToThis={e.entry.id === tab.openDraftId}
          />
          <ChainItemInsertButton afterThisDraftId={e.entry.id} />
        </div>
      ))}
    </div>
  )
}
