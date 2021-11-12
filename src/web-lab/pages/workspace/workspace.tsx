import { ParsedUrlQuery } from 'querystring'

import { nanoid } from 'nanoid'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { createContext, useContext, useEffect, useState } from 'react'
import { useObservable } from 'rxjs-hooks'
import { TreeNode } from '../../../packages/docdiff/src'
import { Bullet, Card, Doc, DocLocation, workspace } from '../../lib/workspace'

// class NestedNodeValueStore<T> {
//   readonly TEMP_ROOT_ID = 'TEMP_ROOT_ID'
//   readonly root: NestedNode<T>

//   constructor(children: NestedNode<T>[]) {
//     this.root = {
//       id: this.TEMP_ROOT_ID,
//       children,
//     }
//   }

//   get(): NestedNode<T>[] {
//     return this.root.children
//   }

//   set(children: NestedNode<T>[]): void {
//     this.root.children = children
//   }

//   getPartial(path: NodePath): NestedNode<T>[] {
//     return NodeHelper.getPartial(this.root, path).children
//   }

//   setPartial(path: NodePath, children: NestedNode<T>[]): void {
//     // NodeHelper.setPartial(this.root, path, children)
//     this.root.children = children
//   }

//   static fromJSON<T>(json: NestedNodeValueParams<T>): NestedNodeValueStore<T> {
//     const { children } = json
//     return new NestedNodeValueStore(children)
//   }

//   toJSON(): NestedNodeValueParams<T> {
//     return { children: this.root.children }
//   }
// }

// class CardService {
//   readonly card$ = new BehaviorSubject<string | null>(null)
//   set(card: string) {
//     //
//   }
//   create(symbol: string) {
//     //
//   }
// }

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

// const CreateDoc = ({ symbol }: { symbol: string }): JSX.Element => {
//   return (
//     <div>
//       <button
//         onClick={() => {
//           docService.create(symbol, 'Ticker template')
//         }}
//       >
//         Ticker template
//       </button>
//       <button
//         onClick={() => {
//           docService.create(symbol, 'Event template')
//         }}
//       >
//         Event template
//       </button>
//     </div>
//   )
// }

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
      <p>
        <Link
          href={{
            pathname: '/workspace/workspace',
            query: { symbol: 'AAA' },
          }}
        >
          <a>AAA</a>
        </Link>
      </p>
      <p>
        <Link
          href={{
            pathname: '/workspace/workspace',
            query: { symbol: 'BBB' },
          }}
        >
          <a>BBB</a>
        </Link>
      </p>
      <p>
        <Link
          href={{
            pathname: '/workspace/workspace',
            query: { symbol: 'AAA', path: '1.2' },
          }}
        >
          <a>AAA@1.2</a>
        </Link>
      </p>

      <Workspace card={card} loc={loc} />
    </div>
  )
}

export default Page
