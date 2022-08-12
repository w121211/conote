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
        <>
          <DocEl doc={doc} />
          <div className="my-10">
            <ChainItemInsertButton afterThisDraftId={doc.noteDraftCopy.id} />
          </div>

          {/* <div className="relative flex py-5 mt-10 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <div className="flex-shrink mx-4">
              <ChainItemInsertButton afterThisDraftId={doc.noteDraftCopy.id} />
            </div>
            <div className="flex-grow border-t border-gray-400"></div>
          </div> */}
        </>
      )}
    </div>
  )
}

const DocChainEl = (props: {
  leadDraftId: string
  hashDraftId: string | null
}): JSX.Element | null => {
  const { leadDraftId, hashDraftId } = props,
    prevProps = usePrevious(props),
    [loading, setLoading] = useState(true),
    [tab] = useObservable(editorRepo.tab$)

  useEffect(() => {
    if (prevProps === undefined || prevProps.leadDraftId !== leadDraftId) {
      setLoading(true)
      editorChainOpen(leadDraftId, hashDraftId ?? undefined).then(d => {
        setLoading(false)
      })
      return
    }
    if (
      hashDraftId !== null &&
      prevProps !== undefined &&
      prevProps.hashDraftId !== hashDraftId
    ) {
      editorChainItemScrollTo(hashDraftId)
    }
  }, [leadDraftId, hashDraftId])

  // useEffect(() => {
  //   if (hashDraftId) {
  //     const el = document.getElementById(hashDraftId)
  //     if (el) {
  //       el.scrollIntoView()
  //     }
  //   }
  // }, [loading])

  if (loading) {
    return null
  }
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
    </div>
  )
}

export default DocChainEl
