import React, { useEffect, useState } from 'react'
import { useObservable } from '@ngneat/react-rxjs'
import { editorRepo } from '../../stores/editor.repository'
import { DocEl } from '../doc/doc-el'
import { useRouter } from 'next/router'
import { docRepo } from '../../stores/doc.repository'
import { isNil } from 'lodash'
import { editorChainInsert } from '../../events'

const ChainInsertItemSection = ({
  prevDraftId,
}: {
  prevDraftId: string
}): JSX.Element => {
  // const [searchSymbol, qSearchSymbol] = useSearchSymbolLazyQuery(),
  const [value, setValue] = useState(''),
    [isSearching, setIsSearching] = useState(false)

  return (
    <div>
      <div>
        <input
          autoFocus
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          placeholder='Enter topic or URL, eg "Hello world", "https://www..."'
          value={value}
          onChange={e => {
            const { value } = e.target
            setValue(value)
            // if (value.length > 0) {
            //   // searchSymbol({ variables: { term: value } })
            //   setIsSearching(true)
            // } else {
            //   setIsSearching(false)
            // }
          }}
        />
        <button
          onClick={async () => {
            await editorChainInsert(`[[${value}]]`, prevDraftId)
          }}
        >
          <span className="material-symbols-outlined">add_circle</span>
        </button>
      </div>
      {/* <div>
        {isSearching &&
          qSearchSymbol.data?.searchSymbol &&
          qSearchSymbol.data.searchSymbol.map(e => (
            <button key={e.str} onClick={() => setValue(e.str)}>
              {e.str}
            </button>
          ))}
      </div> */}
    </div>
  )
}

const ChainDoc = ({ docUid }: { docUid: string }) => {
  const [doc] = useObservable(docRepo.getDoc$(docUid), {
    initialValue: null,
  })

  // useEffect(() => {
  //   console.log(docUid, doc)
  // }, [doc])

  if (isNil(doc)) {
    return null
  }
  return <DocEl doc={doc} />
}

export const EditorChainEl = (): JSX.Element | null => {
  const router = useRouter(),
    // [alert] = useObservable(editorRepo.alter$),
    // [opening] = useObservable(editorRepo.opening$),
    [chainTab] = useObservable(editorRepo.chainTab$, {
      initialValue: { isOpening: true, chain: [] },
    })

  // useEffect(() => {
  // }, [chainDocEntries])

  // useEffect(() => {
  //   return () => {
  //     editorOpenSymbolInMain(null)
  //   }
  // }, [])

  if (chainTab.chain.length === 0) {
    // router.push('/edit/')
    return <div>chainDocs?.length === 0</div>
  }

  return (
    <>
      {/* {alert && <div>{alert.message}</div>} */}

      {chainTab.chain.map((e, i) => (
        <div key={e.docUid}>
          <ChainDoc docUid={e.docUid} />
          <ChainInsertItemSection prevDraftId={e.entry.id} />
        </div>
      ))}
    </>
  )
}
