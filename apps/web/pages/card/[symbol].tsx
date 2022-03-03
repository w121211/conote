import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useObservable } from 'rxjs-hooks'
import { useCardQuery, useMeQuery } from '../../apollo/query.graphql'
import CardHead from '../../components/card-head'
import { BulletEditor } from '../../components/editor/editor'
import Layout from '../../components/layout'
import Modal from '../../components/modal/modal'
import { Doc } from '../../components/workspace/doc'
import { workspace } from '../../components/workspace/workspace'
import HeaderCardEmojis from '../../components/emoji-up-down/header-card-emojis'
import DiscussModal from '../../components/discuss/modal-page/discuss-modal'
import TemplatePage from '../../components/template'

const MainCardComponent = ({ symbol }: { symbol: string }): JSX.Element | null => {
  const { data: meData } = useMeQuery()
  const { data, error, loading } = useCardQuery({ variables: { symbol } })
  const mainDoc = useObservable(() => workspace.mainDoc$)
  const [hasSym, setHasSym] = useState(false)

  useEffect(() => {
    // console.log(mainDoc?.doc)
    if (data) {
      workspace.openDoc({ symbol, card: data.card ?? null })
    }
    Doc.find({ symbol }).then(resolve => {
      if (resolve) {
        setHasSym(true)
      } else {
        return
      }
    })
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
    <div className=" ">
      {/* <div className="flex-1 min-w-0 "> */}
      <CardHead doc={mainDoc.doc} />
      {/* {mainDoc?.doc?.cardCopy ? ( */}
      {!data.card && !hasSym ? (
        <TemplatePage doc={mainDoc.doc} />
      ) : (
        <BulletEditor doc={mainDoc.doc} readOnly={meData?.me === undefined} />
      )}

      {/* ) : (
        <div>template</div>
      )} */}
      {/* </div> */}
      {/* {mainDoc.doc.cardCopy && (
        <div className="z-20">
          <HeaderCardEmojis cardId={mainDoc.doc.cardCopy.id} />
        </div>
      )} */}
    </div>
  )
}

const ModalCardComponent = ({ symbol }: { symbol: string }): JSX.Element | null => {
  const { data, error, loading } = useCardQuery({ variables: { symbol } })
  const mainDoc = useObservable(() => workspace.mainDoc$)
  const modalDoc = useObservable(() => workspace.modalDoc$)
  const [hasSym, setHasSym] = useState(false)

  useEffect(() => {
    if (data && mainDoc?.doc) {
      // ensure main-doc is existed before open modal-doc
      workspace.openDoc({ symbol, card: data.card ?? null, isModal: true })
    }
    Doc.find({ symbol }).then(resolve => {
      if (resolve) {
        setHasSym(true)
      } else {
        return
      }
    })
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
    <div className="flex-1 h-[90vh] ">
      <CardHead doc={modalDoc.doc} />
      {!data.card && !hasSym ? <TemplatePage doc={modalDoc.doc} /> : <BulletEditor doc={modalDoc.doc} />}
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
    const runAsync = async () => {
      const { pathname } = router
      const { symbol, pop } = router.query

      if (typeof symbol !== 'string') {
        return
      }

      if (symbol !== mainSymbol) {
        if (mainDoc?.doc && mainDoc.doc.getChanges().length > 0) {
          await workspace.save(mainDoc.doc) // save previous main-doc before switch to another
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
          // /$A?pop=$B -> /$A?pop=$B
          return
        }
        if (mainDoc?.doc && mainDoc.doc.getChanges().length > 0) {
          workspace.save(mainDoc.doc) // save current main-doc before open modal
        }
        if (modalDoc?.doc && modalDoc.doc.getChanges().length > 0) {
          workspace.save(modalDoc.doc) // save current modal-doc before open another modal
        }
        workspace.closeDoc({ isModal: true })
        setModalSymbol(pop)
        // console.log(`setModalSymbol ${pop}`)
      } else {
        workspace.closeDoc({ isModal: true })
        setModalSymbol(null)
        // console.log(`setModalSymbol null`)
      }
    }

    runAsync().catch(console.error)
  }, [router])

  const onUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault()
    // if (mainDoc?.doc) {
    //   // workspace.save(mainDoc.doc)
    //   console.log('save')
    //   workspace.save(mainDoc.doc)
    //   // return 'save'
    // }

    e.returnValue = 'leave'
    return 'leave'
  }
  useEffect(() => {
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [onUnload])

  return (
    <>
      <Modal
        topLeftBtn={
          <Link href={{ pathname: '/card/[symbol]', query: { symbol: modalSymbol } }}>
            <a className="flex items-center">
              <span className="material-icons text-lg leading-none text-gray-500 hover:text-gray-700">
                open_in_full
              </span>
            </a>
          </Link>
        }
        topRightBtn={
          <div className="flex gap-1">
            <button className="btn-reset-style">
              <span className="material-icons-outlined text-lg leading-none text-gray-500 hover:text-gray-700">
                category
              </span>
            </button>
            <button className="btn-reset-style">
              <span className="material-icons-round text-lg leading-none text-gray-500 hover:text-gray-700">
                more_horiz
              </span>
            </button>
          </div>
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
      <Layout
        buttonRight={
          <>
            {mainDoc?.doc?.cardCopy && (
              <div className="inline-block z-20">
                <HeaderCardEmojis cardId={mainDoc.doc.cardCopy.id} />
              </div>
            )}
            <button
              className="btn-reset-style p-1 hover:bg-gray-100 rounded"
              onClick={() => {
                if (mainDoc?.doc) {
                  workspace.save(mainDoc.doc)
                }
              }}
            >
              <span className="material-icons-outlined text-xl leading-none text-gray-500">save</span>
            </button>
          </>
        }
      >
        {mainCardComponent}
      </Layout>
      <DiscussModal />
    </>
  )
}

export default CardSymbolPage
