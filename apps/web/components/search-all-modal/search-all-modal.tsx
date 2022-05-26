import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Modal from '../modal/modal'
import './search-all-modal.module.css'
import { styleSymbol } from '../ui-component/style-fc/style-symbol'
import { useSearchSymbolLazyQuery } from '../../apollo/query.graphql'

const mockList = [
  {
    title: '[[Awesome Tailwind Css]]',
    keywords: ['[[technology]]', '[[front end]]'],
  },
  { title: '[[Typescript]]', keywords: ['[[Javascript]]', '[[front end]]'] },
  {
    title: '[[Awesome Tailwind Css]]',
    keywords: ['[[technology]]', '[[front end]]'],
  },
  {
    title: '[[Awesome Tailwind Css]]',
    keywords: ['[[technology]]', '[[front end]]'],
  },
  {
    title: '[[Awesome Tailwind Css]]',
    keywords: ['[[technology]]', '[[front end]]'],
  },
  {
    title: '[[Awesome Tailwind Css]]',
    keywords: ['[[technology]]', '[[front end]]'],
  },
]

export const SearchAll = () => {
  const [searchSymbol, { data }] = useSearchSymbolLazyQuery()
  const [showModal, setShowModal] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [keyArrow, setKeyArrow] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(0)
  let modifierKeyPrefix = 'Ctrl'
  const navApp = navigator.userAgent.toLowerCase()
  if (navApp.indexOf('mac') !== -1) {
    modifierKeyPrefix = '⌘'
  }
  // const onMouseEnter = (e: React.MouseEvent, idx: number) => {
  //   if (keyArrow) {
  //     e.preventDefault()
  //   } else {
  //     setSelectedIdx(idx)
  //   }
  // }
  const onMouseLeave = (e: React.MouseEvent, idx: number) => {
    if (keyArrow) {
      e.preventDefault()
    } else {
      setSelectedIdx(idx)
    }
  }

  const onMouseMove = (e: React.MouseEvent, idx: number) => {
    if (keyArrow) {
      e.preventDefault()
    } else {
      setSelectedIdx(idx)
    }
  }

  const onKeydown = (e: React.KeyboardEvent) => {
    if (mockList.length > 0) {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (selectedIdx > 0) {
          setSelectedIdx(prev => prev - 1)
          setKeyArrow(true)
        }
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (
          selectedIdx + 1 < mockList.length ||
          (inputValue.length > 0 && selectedIdx < mockList.length)
        ) {
          setSelectedIdx(prev => prev + 1)
          setKeyArrow(true)
        }
      }
    }
    return
  }

  const onKeyUp = (_: React.KeyboardEvent) => {
    setKeyArrow(false)
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyK' && (e.metaKey || e.ctrlKey)) {
        setShowModal(prev => !prev)
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false)
      }
    }
    if (showModal) {
      document.addEventListener('keydown', onKeyDown)
    } else {
      setInputValue('')
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [showModal])

  useEffect(() => {
    if (inputValue.length > 0) {
      searchSymbol({ variables: { term: inputValue } })
    }
  }, [inputValue])

  useLayoutEffect(() => {
    if (keyArrow || (inputValue && selectedIdx === 0)) {
      const selected = document.querySelector('[aria-selected="true"]')
      selected &&
        selected.scrollIntoView({
          block: selectedIdx === 0 ? 'end' : 'nearest',
        })
    }
    // setKeyArrow(false)
  }, [keyArrow, inputValue])

  return (
    <>
      {/* --- search button --- */}
      <button
        className="
          flex items-center 
          w-full 
          p-1
           border-gray-200 dark:border-gray-500
          rounded
          bg-gray-100
          hover:bg-gray-200/70
          text-sm
          capitalize"
        onClick={() => {
          setShowModal(true)
        }}
      >
        <span className="material-icons mr-1 text-xl text-gray-400 leading-none">
          search
        </span>
        <div className="flex-1 flex">
          <p className="flex-grow text-left text-gray-400">search</p>
          <span className="text-gray-500 dark:text-gray-300">
            <kbd className="inline-flex justify-center min-w-[20px] mr-[2px] px-1 py-[2px] rounded-sm bg-gray-300/70 dark:bg-gray-600 font-sans text-xs leading-none">
              {modifierKeyPrefix}
            </kbd>
            <kbd className="inline-flex justify-center min-w-[20px] mr-[2px] px-1 py-[2px] rounded-sm bg-gray-300/70 dark:bg-gray-600 font-sans text-xs leading-none">
              K
            </kbd>
          </span>
        </div>
      </button>

      {/* --- search modal --- */}
      <Modal
        sectionClassName="!bg-gray-100 dark:bg-gray-700 !w-[500px] "
        visible={showModal}
        onClose={() => {
          setShowModal(false)
        }}
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
              onKeyDown={onKeydown}
              onKeyUp={onKeyUp}
            />
          </div>

          {/* list */}
          <div className="flex-1 overflow-y-auto pb-2">
            <section className="px-4 border-gray-200 dark:border-gray-500">
              {inputValue.length > 0 ? (
                // --- result list ---
                <>
                  <p
                    className="mt-2 px-2 py-3 rounded hover:cursor-pointer text-sm"
                    onMouseLeave={e => onMouseLeave(e, 0)}
                    onMouseMove={e => onMouseMove(e, 0)}
                    role="option"
                    aria-selected={selectedIdx === 0}
                  >
                    <span className="mr-2 text-gray-500 dark:text-gray-400 uppercase font-bold">
                      create symbol
                    </span>
                    <span className="text-gray-800 dark:text-gray-200 font-bold">
                      {inputValue}
                    </span>
                  </p>
                  <ul className="text-gray-700/80 dark:text-gray-200/70">
                    {data?.searchSymbol.map(({ str, id }, i) => {
                      return (
                        <li
                          key={id}
                          className="flex flex-col gap-1 px-2 py-3 rounded hover:cursor-pointer"
                          onMouseLeave={e => onMouseLeave(e, i + 1)}
                          onMouseMove={e => onMouseMove(e, i + 1)}
                          role="option"
                          aria-selected={i + 1 === selectedIdx}
                        >
                          <h4 className="font-medium leading-relaxed">
                            {styleSymbol(str, '')}
                          </h4>
                          <p className="flex text-xs text-blue-500/80 dark:text-blue-300/80 gap-1 ">
                            {/* {keywords.map(keyword => {
                              return styleSymbol(keyword, '')
                            })} */}
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                </>
              ) : (
                // recent list
                <>
                  <header className="mt-6 mb-3 pl-2 pb-2 border-b border-inherit text-gray-700 dark:text-gray-200">
                    <h2 className=" font-semibold capitalize ">recent</h2>
                  </header>
                  <ul className="text-gray-700/80 dark:text-gray-200/70">
                    {mockList.map(({ title, keywords }, i) => {
                      return (
                        <li
                          key={i}
                          className="flex flex-col gap-1 px-2 py-3 rounded hover:cursor-pointer"
                          // onMouseEnter={e => onMouseEnter(e, i)}
                          onMouseLeave={e => onMouseLeave(e, i)}
                          onMouseMove={e => onMouseMove(e, i)}
                          role="option"
                          aria-selected={i === selectedIdx}
                        >
                          <h4 className="font-medium leading-relaxed ">
                            {styleSymbol(title, '')}
                          </h4>
                          <p className="flex text-xs text-blue-500/80 dark:text-blue-300/80 gap-1 ">
                            {keywords.map(keyword => {
                              return styleSymbol(keyword, '')
                            })}
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                </>
              )}
            </section>
          </div>

          <footer className="px-4 py-2 shadow-footer dark:shadow-footer-dark">
            <ul className="flex gap-4 text-xs leading-none text-gray-500 dark:text-gray-400">
              <li className=" ">
                <kbd className="inline-block mr-[2px] py-[2px] px-1 rounded-sm font-sans bg-gray-300/50 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                  ↑
                </kbd>
                <kbd className="inline-block mr-1 py-[2px] px-1 rounded-sm  font-sans bg-gray-300/50 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
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
    </>
  )
}
