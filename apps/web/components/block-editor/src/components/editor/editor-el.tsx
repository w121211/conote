import React, { useEffect } from 'react'
import { useObservable } from '@ngneat/react-rxjs'
import { editorRouteChange } from '../../events'
import { editorRepo } from '../../stores/editor.repository'
import { DocEl } from '../doc/doc-el'
import Modal from '../../../../modal/modal'

type EditorElProps = {
  route: {
    symbol: string
    modal?: {
      symbol?: string
      discussId?: string
      discussTitle?: string
    }
  }
}

export const EditorEl = ({ route }: EditorElProps): JSX.Element | null => {
  const [mainDoc] = useObservable(editorRepo.mainDoc$),
    [modalDoc] = useObservable(editorRepo.modalDoc$)

  useEffect(() => {
    // console.log(route)
    editorRouteChange(route.symbol)
  }, [route])

  console.log(mainDoc)

  if (mainDoc === undefined) {
    // wait until doc is loaded
    return null
  }
  return (
    <>
      <DocEl doc={mainDoc} />
      <Modal visible={modalDoc !== undefined} onClose={() => null}>
        {modalDoc && <DocEl doc={modalDoc} />}
      </Modal>
    </>
  )
}
