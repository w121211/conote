import React, { useEffect, useState } from 'react'
import { useObservable } from '@ngneat/react-rxjs'
import {
  editorRepo,
  isChainItem,
} from '../../../editor-textarea/src/stores/editor.repository'
import { docRepo } from '../../../editor-textarea/src/stores/doc.repository'
import ChainItemInsertButton from '../../../editor-textarea/src/components/editor/chain-item-insert-button'
import { usePrevious } from 'react-use'
import {
  editorChainItemScrollTo,
  editorChainOpen,
} from '../../../editor-textarea/src/events'
import DocEl from './DocEl'

const DocItem = (props: { docUid: string; draftId: string }) => {
  const { docUid, draftId } = props
  const [doc] = useObservable(docRepo.getDoc$(docUid), {
    initialValue: null,
  })

  return (
    <div id={draftId}>
      {doc && (
        <div className="mb-10">
          <DocEl doc={doc} />
          {/* <div className="my-10">
            <ChainItemInsertButton afterThisDraftId={doc.noteDraftCopy.id} />
          </div> */}

          {/* <div className="relative flex py-5 mt-10 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <div className="flex-shrink mx-4">
              <ChainItemInsertButton afterThisDraftId={doc.noteDraftCopy.id} />
            </div>
            <div className="flex-grow border-t border-gray-400"></div>
          </div> */}
        </div>
      )}
    </div>
  )
}

interface Props {
  // The id of the first item in the chain
  leadDraftId: string

  // The id of the anchor item in the chain, specified in the URL's hash part (ie, anchor)
  anchorDraftId: string | null
}

const DocChainEl = (props: Props): JSX.Element | null => {
  const { leadDraftId, anchorDraftId } = props
  const prevProps = usePrevious(props)
  const [loading, setLoading] = useState(true)
  const [tab] = useObservable(editorRepo.tab$)

  useEffect(() => {
    if (prevProps === undefined || prevProps.leadDraftId !== leadDraftId) {
      setLoading(true)
      editorChainOpen(leadDraftId, anchorDraftId ?? undefined).then(d => {
        setLoading(false)
      })
      return
    }
    if (
      anchorDraftId !== null &&
      prevProps !== undefined &&
      prevProps.anchorDraftId !== anchorDraftId
    ) {
      editorChainItemScrollTo(anchorDraftId)
    }
  }, [leadDraftId, anchorDraftId])

  if (loading) {
    return null
  }

  const lastChainItem = tab.chain[tab.chain.length - 1]

  return (
    <div>
      {tab.chain.map((e, i) => {
        if (isChainItem(e)) {
          return (
            <div key={e.docUid}>
              <DocItem docUid={e.docUid} draftId={e.entry.id} />
            </div>
          )
        }
        return <div key={e.symbol}>Opening {e.symbol}</div>
      })}

      {lastChainItem && isChainItem(lastChainItem) && (
        <ChainItemInsertButton afterThisDraftId={lastChainItem.entry.id} />
      )}
    </div>
  )
}

export default DocChainEl
