import React, { useEffect, useState } from 'react'
import { useObservable } from '@ngneat/react-rxjs'
import Link from 'next/link'
import {
  editorRepo,
  isChainItem,
} from '../../../editor-textarea/src/stores/editor.repository'
import { docRepo } from '../../../editor-textarea/src/stores/doc.repository'
import { getNotePageURL } from '../../../../utils'
import ChainItemInsertButton from '../../../editor-textarea/src/components/editor/chain-item-insert-button'
import DocHead from '../../../editor-textarea/src/components/doc/doc-head'
import SlateDocEl from './slate-doc-el'
import { usePrevious } from 'react-use'
import { editorChainOpen } from '../../../editor-textarea/src/events'
import DocPreview from './doc-preview'

const ChainDoc = (props: { docUid: string; draftId: string }) => {
  const { docUid, draftId } = props
  const [showPreview, setShowPreview] = useState(false)

  const [doc] = useObservable(docRepo.getDoc$(docUid), {
    initialValue: null,
  })

  return (
    <div id={draftId} className="mb-20">
      {doc && (
        <div id={docUid}>
          <button onClick={() => setShowPreview(!showPreview)}>Preview</button>

          {doc.noteCopy && (
            <Link href={getNotePageURL(doc.noteCopy.sym.symbol)}>
              <a className="btn-secondary text-sm">View current head note</a>
            </Link>
          )}
          <DocHead doc={doc} />

          {showPreview ? (
            <DocPreview docUid={docUid} />
          ) : (
            <SlateDocEl doc={doc} />
          )}

          <ChainItemInsertButton afterThisDraftId={doc.noteDraftCopy.id} />
        </div>
      )}
    </div>
  )
}

const SlateDocChainEl = (props: {
  draftId: string
  hashDraftId: string | null
}): JSX.Element | null => {
  const { draftId, hashDraftId } = props,
    prevProps = usePrevious(props),
    [loading, setLoading] = useState(true),
    [tab] = useObservable(editorRepo.tab$)

  useEffect(() => {
    if (prevProps === undefined || prevProps.draftId !== draftId) {
      setLoading(true)
      editorChainOpen(draftId).then(d => {
        setLoading(false)
      })
    }
  }, [draftId, hashDraftId])

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
              <ChainDoc docUid={e.docUid} draftId={e.entry.id} />
            </div>
          )
        }
        return <div key={e.symbol}>Opening {e.symbol}</div>
      })}
    </div>
  )
}

export default SlateDocChainEl
