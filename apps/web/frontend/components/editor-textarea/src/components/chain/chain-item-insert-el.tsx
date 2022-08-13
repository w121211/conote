import React, { useEffect, useState } from 'react'
import { editorChainItemInsert } from '../../events'

const ChainItemInsertEl = ({
  prevDraftId,
}: {
  prevDraftId: string | null
}): JSX.Element => {
  // const [searchSymbol, qSearchSymbol] = useSearchSymbolLazyQuery(),
  const [value, setValue] = useState(''),
    [isSearching, setIsSearching] = useState(false),
    [symbolOpening, setSymbolOpening] = useState<string | null>(null)

  if (symbolOpening !== null) {
    return <div>Opening {symbolOpening}</div>
  }
  return (
    <div>
      {/* <div>
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
            const symbol = `[[${value}]]`
            setSymbolOpening(symbol)
            await editorChainItemInsert(symbol, prevDraftId)
            setSymbolOpening(null)
            setValue('')
          }}
        >
          <span className="material-icons-outlined">add_circle</span>
        </button>
      </div> */}
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

export default ChainItemInsertEl
