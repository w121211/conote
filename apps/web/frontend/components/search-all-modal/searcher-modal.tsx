import React, { useEffect, useState } from 'react'
import { useObservable } from '@ngneat/react-rxjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  SearchSymbolQuery,
  useSearchSymbolLazyQuery,
} from '../../../apollo/query.graphql'
import Modal from '../modal/modal'
import { SearcherProps, searcherRepo } from '../../stores/searcher.repository'
import { styleSymbol } from '../ui-component/style-fc/style-symbol'
import { getDraftPageURLBySymbol, getNotePageURL } from '../../utils'
import classes from './search-all-modal.module.css'

type ItemProps = {
  inputValue: string
  searchSymbolHits: SearchSymbolQuery['searchSymbol']
  selectedIdx: number
  onMouseLeave: (e: React.MouseEvent, idx: number) => void
  onMouseMove: (e: React.MouseEvent, idx: number) => void
  setShowModal: (v: boolean) => void
}

const HitList = ({
  onClickHit,
  searchSymbolHits,
  selectedIdx,
  onMouseLeave,
  onMouseMove,
  setShowModal,
}: Pick<SearcherProps['searcher'], 'onClickHit'> & ItemProps) => {
  return (
    <ul className="text-gray-700/80 dark:text-gray-200/70">
      {searchSymbolHits.map((hit, i) => (
        <li
          key={hit.id}
          className="flex flex-col gap-1 px-2 py-3 rounded hover:cursor-pointer"
          onMouseLeave={e => onMouseLeave(e, i + 1)}
          onMouseMove={e => onMouseMove(e, i + 1)}
          // onClick={() => setShowModal(false)}
          role="option"
          aria-selected={i + 1 === selectedIdx}
        >
          {onClickHit ? (
            <button
              onClick={e => {
                onClickHit(hit)
                setShowModal(false)
              }}
            >
              <h5 className="font-medium leading-relaxed">
                {styleSymbol(hit.str, '')}
              </h5>
              {/* <p className="flex text-xs text-blue-500/80 dark:text-blue-300/80 gap-1 ">
                              {domain.map(keyword => {
                                return styleSymbol(keyword, '')
                              })}
                            </p> */}
            </button>
          ) : (
            <Link href={getNotePageURL(hit.str)}>
              <a onClick={() => setShowModal(false)}>
                <h5 className="font-medium leading-relaxed">
                  {styleSymbol(hit.str, '')}
                </h5>
                {/* <p className="flex text-xs text-blue-500/80 dark:text-blue-300/80 gap-1 ">
                              {domain.map(keyword => {
                                return styleSymbol(keyword, '')
                              })}
                            </p> */}
              </a>
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}

const SymbolCreate = ({
  onClickSymbolCreate,
  inputValue,
  selectedIdx,
  onMouseLeave,
  onMouseMove,
  setShowModal,
}: Pick<SearcherProps['searcher'], 'onClickSymbolCreate'> & ItemProps) => {
  const symbol = `[[${inputValue}]]`

  if (onClickSymbolCreate) {
    return (
      <button
        onClick={e => {
          onClickSymbolCreate(symbol)
          setShowModal(false)
        }}
      >
        <span
          className="mt-2 px-2 py-3 rounded hover:cursor-pointer"
          onMouseLeave={e => onMouseLeave(e, 0)}
          onMouseMove={e => onMouseMove(e, 0)}
          // onClick={() => setShowModal(false)}
          role="option"
          aria-selected={selectedIdx === 0}
        >
          <span className="mr-2 text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">
            create symbol
          </span>
          <span className="text-gray-800 dark:text-gray-200 font-bold">
            {inputValue}
          </span>
        </span>
      </button>
    )
  }
  return (
    <Link href={getDraftPageURLBySymbol(symbol)}>
      <a>
        <span
          className="mt-2 px-2 py-3 rounded hover:cursor-pointer"
          onMouseLeave={e => onMouseLeave(e, 0)}
          onMouseMove={e => onMouseMove(e, 0)}
          onClick={() => setShowModal(false)}
          role="option"
          aria-selected={selectedIdx === 0}
        >
          <span className="mr-2 text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">
            create symbol
          </span>
          <span className="text-gray-800 dark:text-gray-200 font-bold">
            {inputValue}
          </span>
        </span>
      </a>
    </Link>
  )
}

/**
 *
 */
const SearcherModal = () => {
  const router = useRouter()

  const [showModal] = useObservable(searcherRepo.showModal$),
    [searcher] = useObservable(searcherRepo.searcher$),
    { onClickHit, onClickSymbolCreate } = searcher,
    setShowModal = searcherRepo.setShowModal

  // const [keyPrefix, setKeyPrefix] = useState('ctrl')
  const [inputValue, setInputValue] = useState('')
  const [arrowKeyDown, setArrowKeyDown] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [searchSymbol, qSearchSymbol] = useSearchSymbolLazyQuery()

  // const onMouseEnter = (e: React.MouseEvent, idx: number) => {
  //   if (keyArrow) {
  //     e.preventDefault()
  //   } else {
  //     setSelectedIdx(idx)
  //   }
  // }

  function onMouseLeave(e: React.MouseEvent, idx: number) {
    if (arrowKeyDown) {
      e.preventDefault()
    } else {
      setSelectedIdx(idx)
    }
  }

  function onMouseMove(e: React.MouseEvent, idx: number) {
    if (arrowKeyDown) {
      e.preventDefault()
    } else {
      setSelectedIdx(idx)
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    // const dataList = inputValue.length > 0 ? data?.searchSymbol : mockList
    const { key, nativeEvent } = e,
      hits = inputValue.length > 0 ? qSearchSymbol.data?.searchSymbol ?? [] : []

    // if (compositionStart && !compositionEnd) return
    if (nativeEvent.isComposing) return

    if (key === 'ArrowUp' && hits.length > 0) {
      e.preventDefault()
      if (selectedIdx > 0) {
        setSelectedIdx(v => v - 1)
        setArrowKeyDown(true)
      }
    } else if (key === 'ArrowDown' && hits.length > 0) {
      e.preventDefault()
      if (selectedIdx < hits.length) {
        setSelectedIdx(v => v + 1)
        setArrowKeyDown(true)
      }
    } else if (key === 'Enter') {
      if (inputValue.length > 0) {
        if (selectedIdx === 0) {
          // Create symbol
          const symbol = `[[${inputValue}]]`
          if (onClickSymbolCreate) {
            onClickSymbolCreate(symbol)
          } else {
            router.push(getDraftPageURLBySymbol(symbol))
          }
          setShowModal(false)
        } else if (hits.length > 0) {
          // Hit
          const hit = hits[selectedIdx - 1]
          if (onClickHit) {
            onClickHit(hit)
          } else {
            router.push(getNotePageURL(hit.str))
          }
          setShowModal(false)
        }
      }
    } else if (key === 'Escape') {
      setShowModal(false)
    }
  }

  function onKeyUp(_: React.KeyboardEvent) {
    setArrowKeyDown(false)
  }

  // useEffect(() => {
  //   const navApp = navigator?.userAgent.toLowerCase()
  //   if (navApp.indexOf('mac') !== -1) {
  //     setKeyPrefix('⌘')
  //   }
  // }, [])

  // useEffect(() => {
  //   const onKeyDown = (e: KeyboardEvent) => {
  //     if (e.code === 'KeyK' && (e.metaKey || e.ctrlKey)) {
  //       setShowModal(prev => !prev)
  //     }
  //   }
  //   document.addEventListener('keydown', onKeyDown)
  //   return () => {
  //     document.removeEventListener('keydown', onKeyDown)
  //   }
  // }, [])

  useEffect(() => {
    if (inputValue.length > 0) {
      searchSymbol({ variables: { term: inputValue } })
    }
  }, [inputValue])

  useEffect(() => {
    if (!showModal) {
      setInputValue('')
    }
  }, [showModal])

  useEffect(() => {
    if (arrowKeyDown || (inputValue && selectedIdx === 0)) {
      const selected = document.querySelector('[aria-selected="true"]')
      if (selected)
        selected.scrollIntoView({
          block: selectedIdx === 0 ? 'end' : 'nearest',
        })
    }
    // setKeyArrow(false)
  }, [arrowKeyDown, inputValue])

  const props: ItemProps = {
    inputValue,
    searchSymbolHits: qSearchSymbol.data?.searchSymbol ?? [],
    selectedIdx,
    onMouseLeave,
    onMouseMove,
    setShowModal,
  }

  return (
    <Modal
      sectionClassName={`dark:bg-gray-700 !w-[600px] searchModal ${classes.searchModal}`}
      visible={showModal}
      onClose={() => setShowModal(false)}
    >
      <div className="flex flex-col h-full border-gray-200 dark:border-gray-500">
        {/* --- input --- */}
        <div className="flex items-center mx-4 border-b border-inherit">
          <span className="material-icons text-xl text-gray-400 leading-none">
            search
          </span>
          <input
            className="w-full h-12 mx-2 outline-none bg-transparent text-gray-800 dark:text-gray-200 dark:caret-gray-100"
            autoFocus
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
            placeholder="Search"
            onChange={e => {
              setSelectedIdx(0)
              setInputValue(e.target.value)
            }}
            onKeyDown={e => onKeyDown(e)}
            onKeyUp={e => onKeyUp(e)}
          />
        </div>

        {/* --- list --- */}
        <div className="flex-1 overflow-y-auto pb-2">
          <section className="px-4 border-gray-200 dark:border-gray-500">
            {inputValue.length > 0 ? (
              <>
                <SymbolCreate {...{ ...props, onClickSymbolCreate }} />
                <HitList {...{ ...props, onClickHit }} />
              </>
            ) : (
              // TODO
              <div>Empty</div>
            )}
            {/* ) : (
                // recent list
                <>
                  <header className="mt-6 mb-3 pl-2 pb-2 border-b border-inherit text-gray-700 dark:text-gray-200">
                    <h5 className=" font-semibold capitalize ">recent</h5>
                  </header>
                  <ul className="text-gray-700/80 dark:text-gray-200/70">
                    {mockList.map(({ str, domain }, i) => {
                      return (
                        <li
                          key={i}
                          className="flex items-center gap-4 px-2 py-3 rounded hover:cursor-pointer"
                          // onMouseEnter={e => onMouseEnter(e, i)}
                          onMouseLeave={e => onMouseLeave(e, i)}
                          onMouseMove={e => onMouseMove(e, i)}
                          role="option"
                          aria-selected={i === selectedIdx}
                        >
                          <span className="p-1 rounded text-xs text-gray-500/80 dark:text-gray-300/80 bg-gray-200">
                            {styleSymbol(domain, '')}
                          </span>
                          <h5 className="my-0 font-medium leading-relaxed ">
                            {styleSymbol(str, '')}
                          </h5>
                        </li>
                      )
                    })}
                  </ul>
                </>
              )} */}
          </section>
        </div>

        {/* <footer className="px-4 py-2 shadow-footer dark:shadow-footer-dark"> */}
        <footer className="px-4 py-2 border-t border-gray-200">
          <ul className="flex gap-4 text-xs leading-none text-gray-500 dark:text-gray-400">
            <li className=" ">
              <kbd className="inline-block mr-[2px] py-[2px] px-1 rounded-sm font-sans bg-gray-300/50 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                ↑
              </kbd>
              <kbd className="inline-block mr-1 py-[2px] px-1 rounded-sm font-sans bg-gray-300/50 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                ↓
              </kbd>
              <span>to navigate</span>
            </li>
            <li>
              <kbd className="inline-block mr-1 py-[2px] px-1 rounded-sm bg-gray-300/50 dark:bg-gray-600  text-gray-600 dark:text-gray-300 ">
                esc
              </kbd>
              <span>to close</span>
            </li>
          </ul>
        </footer>
      </div>
    </Modal>
  )
}

export default SearcherModal
