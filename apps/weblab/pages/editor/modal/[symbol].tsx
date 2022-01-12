import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#__next')

const CardEditor = ({ symbol, from }: { symbol: string; from?: string }) => {
  // console.log(`render CardEditor ${symbol}`)
  // useEffect(() => {
  //   console.log('render CardEditor')
  // }, [])
  const router = useRouter()
  if (!router.isReady) {
    return null
  }
  return (
    <div>
      <Link
        href={{
          pathname: router.pathname,
          query: {
            symbol: router.query.symbol,
            pop: 'C',
            from: symbol,
          },
        }}
      >
        <a>$C</a>
      </Link>
      <Link
        href={{
          pathname: router.pathname,
          query: {
            symbol: router.query.symbol,
            pop: 'D',
            from: symbol,
          },
        }}
      >
        <a>$D</a>
      </Link>
    </div>
  )
}

const MainCard = ({ symbol }: { symbol: string; from?: string }) => {
  console.log(`render CardEditor ${symbol}`)
  // useEffect(() => {
  //   console.log('render CardEditor')
  // }, [])
  return (
    <div>
      <h1>{symbol}</h1>
      <CardEditor symbol={symbol} />
    </div>
  )
}

const ModalCard = ({
  symbol,
  from,
}: {
  // mainSymbol: string
  symbol: string
  from: string
}) => {
  console.log('render ModalCardEditor')
  // useEffect(() => {
  //   console.log('render ModalCardEditor')
  // }, [])
  return (
    <div>
      <h1>{symbol} (Modal)</h1>
      {/* <Link href={`/editor/modal/${mainSymbol}/?pop=C&from=${modalSymbol}`}>
        <a>$C</a>
      </Link> */}
      <CardEditor symbol={symbol} from={from} />
    </div>
  )
}

const Page = () => {
  const router = useRouter()
  const [mainSymbol, setMainSymbol] = useState<string | null>(null)
  const [modalSymbol, setModalSymbol] = useState<{
    pop: string
    from: string
  } | null>(null)

  console.log('entry', mainSymbol, modalSymbol)

  const mainCard = useMemo(() => {
    if (mainSymbol === null) {
      return null
    }
    return <MainCard symbol={mainSymbol} />
  }, [mainSymbol])

  const modalCard = useMemo(() => {
    if (modalSymbol === null) {
      return null
    }
    return <ModalCard symbol={modalSymbol.pop} from={modalSymbol.from} />
  }, [modalSymbol])

  useEffect(() => {
    if (router.isReady) {
      const { symbol, pop, from } = router.query
      console.log('router', symbol, pop, from)

      if (typeof symbol !== 'string') {
        return
      }
      if (symbol !== mainSymbol) {
        setMainSymbol(symbol)
      }
      if (typeof pop === 'string' && typeof from === 'string') {
        if (pop === symbol) {
          router.push(`/editor/modal/${symbol}`) // /$A?pop=$A -> /$A
          return
        }
        if (pop === from) {
          router.push(`/editor/modal/${symbol}?pop=${pop}&from=${symbol}`) // /$A?pop=$B&from=$B -> /$A?pop=$B&from=$A
          return
        }
        if (pop === modalSymbol?.pop && from === modalSymbol?.from) {
          return
        }
        setModalSymbol({ pop, from })
        console.log('setModalSymbol')
      } else {
        setModalSymbol(null)
        console.log('setModalSymbol null')
      }
    }
  }, [router])

  if (Array.isArray(router.query.symbol) || Array.isArray(router.query.pop)) {
    return <div>Unknwon URL query</div>
  }
  if (mainSymbol === null) {
    // return null
    return (
      <Link href={`/editor/modal/${mainSymbol}/?pop=B`} shallow={true}>
        <a>$B</a>
      </Link>
    )
  }
  return (
    <>
      <Modal
        isOpen={modalSymbol !== null}
        onRequestClose={() => {
          console.log('onRequestClose')
          router.push(`/editor/modal/${mainSymbol}`)
        }}
        // contentLabel="Modal Editor"
      >
        {/* <Post id={postId} pathname={router.pathname} /> */}
        {/* <ListEditor /> */}
        {modalCard}
        {/* <Link href={`/editor/modal/${mainSymbol}/?pop=B`}>
          <a>$B</a>
        </Link> */}
      </Modal>

      {/* <button
        onClick={() => {
          setShowModal(true)
        }}
      >
        Open modal editor
      </button> */}

      <Link href={`/editor/modal/${mainSymbol}/?pop=B`}>
        <a>pop($B)</a>
      </Link>
      <Link href={`/editor/modal/F`}>
        <a>/$F</a>
      </Link>
      <Link href={`/editor/modal/A`}>
        <a>/$A</a>
      </Link>

      {/* <ListEditor /> */}
      {/* <CardEditor symbol={mainSymbol} /> */}
      {mainCard}
    </>
  )
}

export default Page
