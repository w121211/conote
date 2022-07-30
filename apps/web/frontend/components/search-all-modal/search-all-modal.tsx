import React, { useEffect, useState } from 'react'
import Modal from '../modal/modal'
import classes from './search-all-modal.module.css'
import { styleSymbol } from '../ui-component/style-fc/style-symbol'
import { useSearchSymbolLazyQuery } from '../../../apollo/query.graphql'
import { getNotePageURL } from '../../utils'
import Link from 'next/link'
import { useRouter } from 'next/router'

const mockList = [
  {
    str: '[[Awesome Tailwind Css]]',
    domain: 'web',
  },
  { str: '[[Typescript]]', domain: 'web' },
  {
    str: '[[Awesome Tailwind Css]]',
    domain: 'dev',
  },
  {
    str: '[[Awesome Tailwind Css]]',
    domain: 'web',
  },
  {
    str: '[[Awesome Tailwind Css]]',
    domain: 'dev',
  },
  {
    str: '[[Awesome Tailwind Css]]',
    domain: 'web',
  },
]

const SearchAllModal = () => {
  // const [keyPrefix, setKeyPrefix] = useState('ctrl')
  const [showModal, setShowModal] = useState(false)
  const [compositionStart, setCompositionStart] = useState(false)
  const [compositionEnd, setCompositionEnd] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [keyArrow, setKeyArrow] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const router = useRouter()
  const [searchSymbol, { data }] = useSearchSymbolLazyQuery()

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
    const dataList = inputValue.length > 0 ? data?.searchSymbol : mockList
    if (compositionStart && !compositionEnd) {
      return
    }
    if (dataList && dataList.length > 0) {
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
          selectedIdx + 1 < dataList.length ||
          (inputValue.length > 0 && selectedIdx < dataList.length)
        ) {
          setSelectedIdx(prev => prev + 1)
          setKeyArrow(true)
        }
      }
    }
    if (e.key === 'Enter') {
      if (inputValue.length > 0) {
        /* ---selectedIdx === i+1--- */
        /* ---create symbol is selected--- */
        if (selectedIdx === 0) {
          router.push(getNotePageURL(`[[${inputValue}]]`))
          setShowModal(false)
        } else if (dataList && dataList.length > 0) {
          /* ---select data item--- */
          router.push(getNotePageURL(dataList[selectedIdx - 1].str))
          setShowModal(false)
        }
      }
    }
    return
  }

  const onKeyUp = (_: React.KeyboardEvent) => {
    setKeyArrow(false)
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

  useEffect(() => {
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
          bg-gray-200/60
          hover:bg-gray-200
          transition-['background-color']
          duration-200
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
          <span className="flex-grow mr-10 text-left text-gray-400">
            search
          </span>
          {/* <span className="text-gray-500 dark:text-gray-300">
            <kbd className="inline-flex justify-center min-w-[20px] mr-[2px] px-1 py-[2px] rounded-sm bg-gray-300/70 dark:bg-gray-600 font-sans text-xs leading-none">
              {keyPrefix}
            </kbd>
            <kbd className="inline-flex justify-center min-w-[20px] mr-[2px] px-1 py-[2px] rounded-sm bg-gray-300/70 dark:bg-gray-600 font-sans text-xs leading-none">
              K
            </kbd>
          </span> */}
        </div>
      </button>

      {/* --- search modal --- */}
      <Modal
        sectionClassName={`dark:bg-gray-700 !w-[600px] searchModal ${classes.searchModal}`}
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
                if (!compositionStart && compositionEnd) {
                  // console.log('onchange')
                  setSelectedIdx(0)
                  setInputValue(e.target.value)
                }
              }}
              onCompositionStart={() => {
                // console.log('composition start')
                setCompositionStart(true)
                setCompositionEnd(false)
              }}
              onCompositionEnd={e => {
                // console.log(
                //   'composition end',
                //   (e.target as HTMLInputElement).value,
                // )
                setCompositionStart(false)
                setCompositionEnd(true)

                setInputValue((e.target as HTMLInputElement).value)
              }}
              onKeyDown={onKeydown}
              onKeyUp={onKeyUp}
            />
          </div>

          {/* --- list --- */}
          <div className="flex-1 overflow-y-auto pb-2">
            <section className="px-4 border-gray-200 dark:border-gray-500">
              {inputValue.length > 0 ? (
                // --- result list ---
                <>
                  <Link href={getNotePageURL(`[[${inputValue}]]`)}>
                    <a>
                      <p
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
                      </p>
                    </a>
                  </Link>
                  <ul className="text-gray-700/80 dark:text-gray-200/70">
                    {data?.searchSymbol.map(({ str, id }, i) => {
                      return (
                        <Link key={id} href={getNotePageURL(str)}>
                          <a>
                            <li
                              className="flex flex-col gap-1 px-2 py-3 rounded hover:cursor-pointer"
                              onMouseLeave={e => onMouseLeave(e, i + 1)}
                              onMouseMove={e => onMouseMove(e, i + 1)}
                              onClick={() => setShowModal(false)}
                              role="option"
                              aria-selected={i + 1 === selectedIdx}
                            >
                              <h5 className="font-medium leading-relaxed">
                                {styleSymbol(str, '')}
                              </h5>
                              {/* <p className="flex text-xs text-blue-500/80 dark:text-blue-300/80 gap-1 ">
                            {domain.map(keyword => {
                              return styleSymbol(keyword, '')
                            })}
                          </p> */}
                            </li>
                          </a>
                        </Link>
                      )
                    })}
                  </ul>
                </>
              ) : (
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
              )}
            </section>
          </div>

          {/* <footer className="px-4 py-2 shadow-footer dark:shadow-footer-dark"> */}
          <footer className="px-4 py-2 border-t border-gray-200">
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

export default SearchAllModal
