import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useObservable } from '@ngneat/react-rxjs'
import Modal from '../../../../modal/modal'
import { editorRouteUpdate } from '../../events'
import { editorRepo } from '../../stores/editor.repository'
import { DocEl } from '../doc/doc-el'

export const EditorEl = (): JSX.Element | null => {
  const [alert] = useObservable(editorRepo.alter$),
    [mainDoc] = useObservable(editorRepo.mainDoc$, { initialValue: null }),
    [modalDoc] = useObservable(editorRepo.modalDoc$, { initialValue: null })

  // useEffect(() => {
  //   console.log(mainDoc)
  //   console.log(modalDoc)
  // }, [modalDoc])

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
