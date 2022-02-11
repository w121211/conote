import { ParsedUrlQuery } from 'querystring'

import { nanoid } from 'nanoid'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { useObservable } from 'rxjs-hooks'
import { TreeNode } from '../../../packages/docdiff/src'
import { Bullet, Card, Doc, DocLocation, workspace } from '../../lib/workspace'

Modal.setAppElement('#__next')

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
        Mutate
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
    throw '[conote] Symbol not found in url query'
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

const Page = (): JSX.Element | null => {
  const router = useRouter()
  const [loc, setLoc] = useState<DocLocation>()
  const [card, setCard] = useState<Card | null>(null)

  const allDocCids = useObservable(() => workspace.allDocCids$)

  useEffect(() => {
    if (router.isReady) {
      const loc = getDocLocation(router.query)
      setLoc(loc)

      const { symbol } = loc

      // Mocking query card result
      if (symbol === 'BBB') {
        // mocking card 'BBB' is not found
        setCard(null)
      } else if (symbol === 'URL') {
        // mocking card 'URL' is a new webpage-card
        setCard({ id: nanoid(), symbol, link: 'some-url.com', state: null })
      } else {
        setCard({
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
        })
      }
    }
  }, [router])

  if (loc === undefined) {
    return null
  }
  return (
    <div>
      {allDocCids && allDocCids.map((e, i) => <button key={i}>{e}</button>)}
      {/* <Modal
        isOpen={true}
        // isOpen={postId !== undefined}
        // onRequestClose={() => router.push('/modal')}
        // contentLabel="Post modal"
      >
        <Workspace card={card} loc={loc} />
      </Modal> */}

      <Workspace card={card} loc={loc} />

      <Workspace card={card} loc={loc} />
    </div>
  )
}

export default Page