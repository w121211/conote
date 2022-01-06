import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useObservable } from 'rxjs-hooks'
import { useCardQuery } from '../../apollo/query.graphql'
import CardHead from '../../components/card-head'
import { BulletEditor } from '../../components/editor/editor'
import Layout from '../../components/layout'
import Modal from '../../components/modal/modal'
import { Doc } from '../../components/workspace/doc'
import { workspace } from '../../components/workspace/workspace'
import HeaderCardEmojis from '../../components/emoji-up-down/header-card-emojis'

const MainCardComponent = ({ symbol }: { symbol: string }): JSX.Element | null => {
  const { data, error, loading } = useCardQuery({ variables: { symbol } })
  const mainDoc = useObservable(() => workspace.mainDoc$)

  useEffect(() => {
    if (data) {
      workspace.openDoc({ symbol, card: data.card ?? null })
    }
  }, [data])

  if (loading) {
    return null
  }
  if (error) {
    console.error(error)
    return <div>Unexpected error</div>
  }
  if (data === undefined) {
    return <div>Unexpected error</div>
  }
  if (mainDoc === null || mainDoc.doc === null) {
    return null
  }
  return (
    <div className="flex gap-12 ">
      <div className="flex-grow">
        <CardHead doc={mainDoc.doc} />
        <BulletEditor doc={mainDoc.doc} />
      </div>
      {mainDoc.doc.cardCopy && (
        <div className="">
          <HeaderCardEmojis cardId={mainDoc.doc.cardCopy.id} />
        </div>
      )}
    </div>
  )
}

const ModalCardComponent = ({ symbol }: { symbol: string }): JSX.Element | null => {
  const { data, error, loading } = useCardQuery({ variables: { symbol } })
  const mainDoc = useObservable(() => workspace.mainDoc$)
  const modalDoc = useObservable(() => workspace.modalDoc$)

  useEffect(() => {
    if (data && mainDoc?.doc) {
      // ensure main-doc is existed before open modal-doc
      workspace.openDoc({ symbol, card: data.card ?? null, isModal: true })
    }
  }, [data, mainDoc])

  if (loading) {
    return null
  }
  if (error) {
    console.error(error)
    return <div>Unexpected error</div>
  }
  if (data === undefined) {
    return <div>Unexpected error</div>
  }
  if (modalDoc === null || modalDoc.doc === null) {
    return null
  }
  return (
    <div className="min-w-[90vw] h-[70vh] sm:min-w-[50vw]">
      <CardHead doc={modalDoc.doc} />
      <BulletEditor doc={modalDoc.doc} />
    </div>
  )
}

const CardSymbolPage = (): JSX.Element | null => {
  const router = useRouter()

  const [mainSymbol, setMainSymbol] = useState<string>()
  const [modalSymbol, setModalSymbol] = useState<string | null>(null)
  const mainDoc = useObservable(() => workspace.mainDoc$)
  const modalDoc = useObservable(() => workspace.modalDoc$)

  const mainCardComponent = useMemo<JSX.Element | null>(() => {
    if (mainSymbol) {
      return <MainCardComponent symbol={mainSymbol} />
    }
    return null
  }, [mainSymbol])
  const modalCardComponent = useMemo<JSX.Element | null>(() => {
    if (modalSymbol) {
      return <ModalCardComponent symbol={modalSymbol} />
    }
    return null
  }, [modalSymbol])

  useEffect(() => {
    const { pathname } = router
    const { symbol, pop } = router.query

    if (typeof symbol !== 'string') {
      return
    }
    if (symbol !== mainSymbol) {
      if (mainDoc?.doc && mainDoc.doc.getChanges().length > 0) {
        workspace.save(mainDoc.doc) // save previous main-doc before switch to another
      }
      workspace.closeDoc({}) // close doc to prevent component rerender
      setMainSymbol(symbol)
    }
    if (typeof pop === 'string') {
      if (pop === symbol) {
        router.push({ pathname, query: { symbol } }) // /$A?pop=$A -> /$A
        return
      }
      if (pop === modalSymbol) {
        return // /$A?pop=$B -> /$A?pop=$B
      }
      if (mainDoc?.doc && mainDoc.doc.getChanges().length > 0) {
        workspace.save(mainDoc.doc) // save current main-doc before open modal
      }
      workspace.closeDoc({ isModal: true }) // close doc to prevent component rerender
      setModalSymbol(pop)
      // console.log(`setModalSymbol ${pop}`)
    } else {
      workspace.closeDoc({ isModal: true }) // close doc to prevent component rerender
      setModalSymbol(null)
      // console.log(`setModalSymbol null`)
    }
  }, [router])

  return (
    <>
      <Modal
        topRightBtn={
          <Link href={{ pathname: '/card/[symbol]', query: { symbol: modalSymbol } }}>
            <a className="flex items-center text-sm text-gray-900 hover:text-gray-600">
              <span className="material-icons text-lg text-gray-500 hover:text-gray-700">open_in_full</span>
            </a>
          </Link>
        }
        visible={modalSymbol !== null}
        onClose={async () => {
          if (mainDoc?.doc && modalDoc?.doc) {
            if (modalDoc.doc.getChanges().length > 0) {
              // console.log(modalDoc.doc.getChanges())
              // TODO: strictly check if doc is truly updated
              if ((await Doc.find({ cid: mainDoc.doc.cid })) === null) {
                await workspace.save(mainDoc.doc) // ensure main-doc also save
              }
              await workspace.save(modalDoc.doc)
              workspace.closeDoc({ isModal: true }) // close doc to prevent component rerender
            }
          }
          router.push({ pathname: router.pathname, query: { symbol: router.query.symbol } })
        }}
      >
        {modalCardComponent}
      </Modal>
      <Layout>{mainCardComponent}</Layout>
    </>
  )
}

export default CardSymbolPage
