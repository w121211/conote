import React, { useEffect, useRef } from 'react'
import { SearchHitFragment } from '../../../../../../apollo/query.graphql'
import { autoCompleteInline, nullSearch } from '../../handlers/textarea-keydown'
import type { CaretPosition, Search } from '../../interfaces'
import { getSearchService } from '../../services/search.service'

const searchService = getSearchService()

function clickHit(
  uid: string,
  hitClicked: SearchHitFragment,
  search: Search,
  setSearch: React.Dispatch<React.SetStateAction<Search>>,
) {
  const id = '#editable-uid-' + uid,
    target = document.querySelector<HTMLTextAreaElement>(id),
    hitStr = searchService.getAutoCompleteStr(search, hitClicked)

  if (target) {
    switch (search.type) {
      // case 'hashtag':
      // autoCompleteHashtag(target, expansion, setSearch)
      //   break
      // case 'template':
      //   fn = autoCompleteTemplate
      default:
        autoCompleteInline(target, hitStr, search, setSearch)
    }
  }
}

export const InlineSearchEl = ({
  blockUid,
  caret,
  search,
  setSearch,
}: {
  blockUid: string
  caret: CaretPosition
  search: Search
  setSearch: React.Dispatch<React.SetStateAction<Search>>
}): JSX.Element | null => {
  const { type, term, hits } = search,
    ref = useRef<HTMLDivElement>(null)

  function handleClickOutside(e: MouseEvent) {
    if (type && e.target && !ref.current?.contains(e.target as Node)) {
      setSearch(nullSearch)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      // console.debug('removeEventListener')
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [type])

  if (type === null) {
    return null
  }
  return (
    <div
      className="absolute bg-white dark:bg-gray-700 z-10  border border-gray-200 dark:border-gray-600 rounded shadow-lg"
      style={{ top: caret.top + 24, left: caret.left + 24 }}
      ref={ref}
      // ;; don't blur textarea when clicking to auto-complete
      onMouseDown={e => e.preventDefault()}
    >
      <div className="dropdown-menu flex flex-col content-start text-gray-700 dark:text-gray-200">
        {term === '' || hits.length === 0 ? (
          <button className="px-4 py-1 text-gray-500 dark:text-gray-400">
            Search for{' '}
            <span className="text-gray-700 dark:text-gray-200 font-bold">
              {type}
            </span>
          </button>
        ) : (
          hits.map((e, i) => {
            // const { nodeTitle, blockStr, blockUid } = e
            const { id, str } = e
            return (
              <button
                className="px-4 py-1 text-left hover:bg-gray-200 dark:hover:bg-gray-600/50"
                key={'inline-search-item-' + id}
                id={'dropdown-item-' + i}
                // isPressed={index === i}
                // ;; if page link, expand to title. otherwise expand to uid for a block ref
                onClick={() => clickHit(blockUid, e, search, setSearch)}
              >
                {str}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
