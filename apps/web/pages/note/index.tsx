import { useState } from 'react'
import { useSearchSymbolLazyQuery } from '../../apollo/query.graphql'

const NoteStarterPage = (): JSX.Element => {
  const [searchSymbol, qSearchSymbol] = useSearchSymbolLazyQuery(),
    [value, setValue] = useState(''),
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
            if (value.length > 0) {
              searchSymbol({ variables: { term: value } })
              setIsSearching(true)
            } else {
              setIsSearching(false)
            }
          }}
        />
        <button>
          <span className="material-symbols-outlined">add_circle</span>
        </button>
      </div>
      <div>
        {isSearching &&
          qSearchSymbol.data?.searchSymbol &&
          qSearchSymbol.data.searchSymbol.map(e => (
            <button key={e.str} onClick={() => setValue(e.str)}>
              {e.str}
            </button>
          ))}
      </div>
    </div>
  )
}

export default NoteStarterPage
