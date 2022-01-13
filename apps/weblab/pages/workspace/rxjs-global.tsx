/**
 * @see
 * https://jasonwatmore.com/post/2020/04/21/react-hooks-rxjs-communicating-between-components-with-observable-subject
 * https://github.com/shujer/rxjs-with-react-demo/blob/main/src/stories/ChatRoom/BehaviorSubject/ChatRoom.tsx
 * https://github.com/LeetCode-OpenSource/rxjs-hooks/blob/master/src/use-observable.ts
 */
import Dexie from 'dexie'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  BehaviorSubject,
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
  of,
  scan,
  share,
  Subject,
  withLatestFrom,
} from 'rxjs'
import { useObservable } from 'rxjs-hooks'

type DocLocation = {
  symbol: string
  mirror?: string
  path?: number[]
}

type OpenDocResult = {
  raw: string | null
  doc: Doc | null
  loading?: true
  error?: string
}

class Doc {
  private value: string

  constructor(value = '') {
    this.value = value
  }

  setValue(value: string): void {
    this.value = value
  }

  getValue(): string {
    return this.value
  }

  setPartialValue(value: string, path: number[]): void {
    this.value = 'partial' + value
  }

  getPartialValue(path: number[]): string {
    return 'partial' + this.value
  }
}

class DocService {
  // public workingDocs$: string[] = []

  public readonly doc$ = new BehaviorSubject<OpenDocResult>({
    raw: null,
    doc: null,
    loading: true,
  })

  private messageSource$ = new Subject<string>()

  public readonly message$ = this.messageSource$.pipe(
    scan((acc, cur) => [...acc, cur], [] as string[])
  )

  async query(symbol: string): Promise<Doc | null> {
    const delay = new Promise((resolve) => setTimeout(resolve, 500)) // in ms
    await delay
    if (symbol === 'AAA') {
      return new Doc('AAA')
    }
    return null // Mock doc not found case
  }

  send(msg: string): void {
    console.log(msg)
    this.messageSource$.next(msg)
  }

  async open(symbol: string): Promise<void> {
    // save current doc (if exist) -> try find in local/remote
    const doc = await this.query(symbol)
    this.doc$.next({ raw: doc?.getValue() ?? null, doc })
  }

  create(template: string): void {
    // this.curDoc$.next('doc' + symbol)
    // this.doc$.next(template)
    const raw = 'doc' + template
    this.doc$.next({ raw, doc: new Doc(raw) })
  }
}

// Globally available
const docService = new DocService()

// const url$ = new BehaviorSubject<string | null>(null)

// const docService = new DocService()
// const DocServiceContext = createContext<DocService>()

// const Url$Context = createContext<BehaviorSubject<string> | null>(null)

const CreateDoc = (): JSX.Element => {
  return (
    <div>
      <button
        onClick={() => {
          docService.create('Ticker template')
        }}
      >
        Ticker template
      </button>
      <button
        onClick={() => {
          docService.create('Event template')
        }}
      >
        Event template
      </button>
    </div>
  )
}

const Workspace = (): JSX.Element | null => {
  console.log('render Workspace')

  const messages = useObservable(() => docService.message$, [])
  const doc = useObservable(() => docService.doc$)

  const router = useRouter()

  useEffect(() => {
    // Detect location change event
    if (router.isReady) {
      const q = router.query
      const symbol = q['symbol']
      if (typeof symbol === 'string') {
        docService.open(symbol)
      }
    }
  }, [router])

  // const url$ = useContext(Url$Context)
  // if (url$ === null) {
  //   throw 'error'
  // }
  // const url = useObservable(() => url$, '')
  // const url = useObservable(() => url$, null)

  // const docService = useContext(DocServiceContext)
  // if (docService === null) {
  //   throw 'error'
  // }

  // const [symbol, setSymbol] = useState<string>('')
  // const messages = useObservable(() => docService.message$, [])

  return (
    <div>
      <p>
        <Link
          href={{
            pathname: '/workspace/rxjs-global',
            query: { symbol: 'AAA' },
          }}
        >
          <a>AAA</a>
        </Link>
      </p>

      <p>
        <Link
          href={{
            pathname: '/workspace/rxjs-global',
            query: { symbol: 'BBB' },
          }}
        >
          <a>BBB</a>
        </Link>
      </p>

      <p>
        <Link
          href={{
            pathname: '/workspace/rxjs-global',
            query: { symbol: 'AAA', path: '1.2' },
          }}
        >
          <a>AAA@1.2</a>
        </Link>
      </p>

      <button
        onClick={() => {
          // docService.open('hello')
          docService.send('hello')
          // setSymbol(symbol + 'A')
          // url$.next(`${url}u`)
        }}
      >
        push
      </button>

      {/* <p>{url}</p> */}

      {/* <p>{symbol}</p> */}

      {/* <p>{curDoc}</p> */}

      {doc?.raw === null ? <CreateDoc /> : <p>{doc?.raw}</p>}

      {messages.map((e, i) => (
        <div key={i}>{e}</div>
      ))}

      {/* <Editor syncValue={doc.value} /> */}
    </div>
  )
}

const Page = (): JSX.Element => {
  console.log('render WorkspacePage')

  // const [location, setLocation] = useState<Location>({
  //   symbol: '$AAA',
  // })

  return <Workspace />

  // return (
  //   <Url$Context.Provider value={new BehaviorSubject('Hello')}>
  //     <Workspace
  //       location={{
  //         symbol: '$AAA',
  //       }}
  //     />
  //   </Url$Context.Provider>
  // )
}

export default Page
