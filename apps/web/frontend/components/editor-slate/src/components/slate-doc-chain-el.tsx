import React, { useEffect } from 'react'
import { useObservable } from '@ngneat/react-rxjs'
import Link from 'next/link'
import { editorRepo } from '../../../editor-textarea/src/stores/editor.repository'
import { docRepo } from '../../../editor-textarea/src/stores/doc.repository'
import { getNotePageURL } from '../../../../utils'
import ChainItemInsertButton from '../../../editor-textarea/src/components/editor/chain-item-insert-button'
import DocHead from '../../../editor-textarea/src/components/doc/doc-head'
import SlateDocEl from './slate-doc-el'
import { editorChainItemOpen } from '../../../editor-textarea/src/events'

const ChainDoc = (props: { docUid: string; draftId: string }) => {
  const { docUid, draftId } = props

  const [doc] = useObservable(docRepo.getDoc$(docUid), {
    initialValue: null,
  })

  return (
    <div id={draftId}>
      {doc && (
        <div id={docUid}>
          <button>View</button>
          {doc.noteCopy && (
            <Link href={getNotePageURL(doc.noteCopy.sym.symbol)}>
              <a>View current head note</a>
            </Link>
          )}
          <DocHead doc={doc} />
          <SlateDocEl doc={doc} />
          <ChainItemInsertButton afterThisDraftId={doc.noteDraftCopy.id} />
        </div>
      )}
    </div>
  )
}

const SlateDocChainEl = ({
  draftId,
  hashDraftId,
}: {
  draftId: string
  hashDraftId: string | null
}): JSX.Element | null => {
  const [tab] = useObservable(editorRepo.tab$)

  useEffect(() => {
    const nextDraftId = hashDraftId ?? draftId
    editorChainItemOpen(nextDraftId)
  }, [draftId, hashDraftId])

  // useEffect(() => {
  //   const { curChainItem, curChain, prevChainItem } = tab
  //   if (curChainItem && curChain.length > 0) {
  //     const isItemInCurChain =
  //         curChain.find(e => e.entry.id === prevChainItem?.draftId) !==
  //         undefined,
  //       isEveryDocRendered = every(curChain, 'rendered'),
  //       isFirstItem = curChainItem.draftId === curChain[0].entry.id
  //     if (isEveryDocRendered && !isItemInCurChain && !isFirstItem) {
  //       const el = document.getElementById(curChainItem.draftId)
  //       if (el) {
  //         el.scrollIntoView()
  //       }
  //     } else if (isFirstItem && isItemInCurChain) {
  //       const el = document.getElementById('layout-children-container')
  //       if (el) {
  //         el.scrollTo({ top: 0 })
  //       }
  //     }
  //   }
  // }, [tab])

  if (tab.curChain.length === 0) {
    return null
  }
  return (
    <div>
      {/* {alert && <div>{alert.message}</div>} */}
      {tab.curChain.map((e, i) => {
        return (
          <div key={e.docUid}>
            <ChainDoc docUid={e.docUid} draftId={e.entry.id} />
          </div>
        )
      })}
    </div>
  )
}

export default SlateDocChainEl
