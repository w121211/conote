import React from 'react'
import { useObservable } from '@ngneat/react-rxjs'
import { docRemove, docSave } from '../../events'
import { editorRepo } from '../../stores/editor.repository'

export const EditorToolbar = (): JSX.Element | null => {
  const [mainDoc] = useObservable(editorRepo.mainDoc$, { initialValue: null })

  if (mainDoc === undefined) {
    return (
      <h1>
        Editor-el without doc (happened when doc is dropped), search-panel goes
        here
      </h1>
    )
  }

  return (
    <>
      <button
        onClick={() => {
          if (mainDoc) {
            docSave(mainDoc)
          }
        }}
      >
        Save
      </button>
      <button
        onClick={() => {
          if (mainDoc) {
            docRemove(mainDoc)
          }
        }}
      >
        Drop
      </button>
    </>
  )
}
