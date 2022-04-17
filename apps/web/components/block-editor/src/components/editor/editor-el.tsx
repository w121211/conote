import React, { useEffect } from 'react'
import { useObservable } from '@ngneat/react-rxjs'
import { editorRouteUpdate } from '../../events'
import { editorRepo } from '../../stores/editor.repository'
import { DocEl } from '../doc/doc-el'
import Modal from '../../../../modal/modal'

export const EditorEl = (): JSX.Element | null => {
  const [alert] = useObservable(editorRepo.alter$),
    [mainDoc] = useObservable(editorRepo.mainDoc$, { initialValue: null }),
    [modalDoc] = useObservable(editorRepo.modalDoc$, { initialValue: null })

  console.log(modalDoc)

  return (
    <>
      {alert && <div>{alert.message}</div>}

      {mainDoc && <DocEl doc={mainDoc} />}

      <Modal
        visible={modalDoc !== undefined && modalDoc !== null}
        onClose={() => editorRouteUpdate({ modalSymbol: null })}
      >
        {modalDoc && <DocEl doc={modalDoc} />}
      </Modal>
    </>
  )
}
