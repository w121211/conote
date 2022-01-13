import { ParsedUrlQuery } from 'querystring'

import { nanoid } from 'nanoid'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { useObservable } from 'rxjs-hooks'
// import { TreeNode } from '../../../packages/docdiff/src'
import { TreeNode } from '@conote/docdiff'
import { Bullet, Card, Doc, DocLocation, workspace } from '../../lib/workspace'

Modal.setAppElement('#__next')

const callMockAPI = (symbol: string): Card | null => {
  // Mocking query card result
  if (symbol === 'BBB') {
    return null // mocking card 'BBB' is not found
  }
  if (symbol === 'URL') {
    // mocking card 'URL' is a new webpage-card
    // setCard({ id: nanoid(), symbol, link: 'some-url.com', state: null })
    return { id: nanoid(), symbol, link: 'some-url.com', state: null }
  }
  return {
    id: nanoid(),
    symbol,
    state: {
      id: nanoid(),
      body: {
        prevStateId: nanoid(),
        subStateIds: [],
        value: [
          {
            cid: 'fake-id',
            data: {
              id: 'fake-id',
              head: `${symbol}: A queried card doc`,
            },
            children: [],
          },
        ],
      },
    },
  }
}

const Editor = ({ doc }: { doc: Doc }): JSX.Element => {
  const [value, setValue] = useState<TreeNode<Bullet>[]>(doc.value)

  useEffect(() => {
    setValue(doc.value)
  }, [doc])

  return (
    <div>
      <button
        onClick={() => {
          doc.value = [
            ...value,
            {
              cid: nanoid(),
              data: { id: nanoid(), head: 'hello world' },
              children: [],
            },
          ]
          setValue(doc.value)
          // shareValue.setPartial([], v)
        }}
      >
        Change
      </button>

      {value.map((e, i) => (
        <div key={i}>{e.data?.head ?? '*******'}</div>
      ))}
    </div>
  )
}

const CardHead = ({
  card,
  symbol,
}: {
  card: Card | null
  symbol: string
}): JSX.Element => {
  return (
    <div>
      <h1>{symbol}</h1>
    </div>
  )
}

const Workspace = ({
  card,
  loc,
}: {
  card: Card | null
  loc: DocLocation
}): JSX.Element | null => {
  const curDoc = useObservable(() => workspace.curDoc$)
  const status = useObservable(() => workspace.status$)

  useEffect(() => {
    workspace.open({ card, loc })
  }, [card, loc])

  useEffect(() => {
    if (status === 'droped') {
      workspace.open({ card, loc })
    }
  }, [status])

  if (loc === undefined || curDoc === null) {
    return null
  }
  if (curDoc.doc === null) {
    return <div>Unexpected error</div>
  }
  return (
    <div>
      <button
        onClick={async () => {
          if (curDoc.doc) {
            await workspace.drop()
          }
        }}
      >
        Drop
      </button>
      <button
        onClick={() => {
          if (curDoc.doc) {
            workspace.commit(curDoc.doc)
          }
        }}
      >
        Commit
      </button>

      <CardHead card={card} symbol={loc.symbol} />

      <Editor doc={curDoc.doc} />
    </div>
  )
}

const getDocLocation = (query: ParsedUrlQuery): DocLocation => {
  const symbol = query['symbol']
  const path = query['p']
  const mirror = query['m']
  const author = query['a']

  if (typeof symbol !== 'string') {
    throw `[conote] 'symbol' not found in url query, ${symbol}`
  }
  return {
    symbol,
    path:
      typeof path === 'string' ? path.split('.').map((e) => parseInt(e)) : [],
    mirror: typeof mirror === 'string' ? mirror : undefined,
    // mirrorSymbol: typeof mirror === 'string' ? mirror : undefined,
    // author: typeof author === 'string' ? author : undefined,
  }
}

type DocPath = {
  symbol: string // use 'symbol' as the cid in local-db
  given: {
    card: Card | null
  }
}

const Page = (): JSX.Element | null => {
  const router = useRouter()
  const [docPath, setDocPath] = useState<DocPath | null>(null)
  const [modalDocPath, setModalDocPath] = useState<DocPath | null>(null)

  // const allDocCids = useObservable(() => workspace.allDocCids$)

  useEffect(() => {
    console.log('useEffect')
    if (router.isReady) {
      const { symbol } = router.query
      if (typeof symbol === 'string') {
        const card = callMockAPI(symbol)
        setDocPath({ symbol, given: { card } })
      }
      // if (typeof symbol2 === 'string') {
      //   const card = callMockAPI(symbol2)
      //   setModalDocPath({ symbol: symbol2, given: { card } })
      // }
    }
  }, [router])

  return (
    <div>
      {/* {allDocCids &&
        allDocCids.map((e, i) => (
          <Link
            key={i}
            href={{
              pathname: '/workspace/basic',
              query: { symbol: e },
            }}
          >
            <a>{e}</a>
          </Link>
        ))} */}
      <p>
        <button
          onClick={() => {
            const symbol2 = 'CCC'
            const card = callMockAPI(symbol2)
            setModalDocPath({ symbol: symbol2, given: { card } })
          }}
        >
          <a>Modal (CCC)</a>
        </button>
      </p>
      <p>
        <Link
          href={{
            pathname: '/workspace/basic',
            query: { symbol: 'AAA' },
          }}
        >
          <a>AAA</a>
        </Link>
      </p>
      <p>
        <Link
          href={{
            pathname: '/workspace/basic',
            query: { symbol: 'BBB' },
          }}
        >
          <a>BBB</a>
        </Link>
      </p>
      <p>
        <Link
          href={{
            pathname: '/workspace/basic',
            query: { symbol: 'AAA', path: '1.2' },
          }}
        >
          <a>AAA@1.2</a>
        </Link>
      </p>

      {/* {docPath && modalDocPath === null && (
        <Workspace card={docPath.given.card} loc={{ symbol: docPath.symbol }} />
      )} */}

      <h1>Modal</h1>

      {/* <Modal
        isOpen={modalDocPath !== null}
        // isOpen={postId !== undefined}
        onRequestClose={() =>
          // router.push({
          //   pathname: '/workspace/basic',
          //   query: { symbol: 'AAA' },
          // })
          setModalDocPath(null)
        }
        // contentLabel="Post modal"
      > */}
      {modalDocPath && (
        <Workspace
          card={modalDocPath.given.card}
          loc={{ symbol: modalDocPath.symbol }}
        />
      )}
      {/* </Modal> */}
    </div>
  )
}

export default Page
