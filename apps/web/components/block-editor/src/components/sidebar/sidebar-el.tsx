import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import { useObservable } from '@ngneat/react-rxjs'
import { editorLeftSidebarRefresh } from '../../events'
import { editorRepo } from '../../stores/editor.repository'
import SidebarSection from './sidebar-section'
import { siderRepo } from '../../../../stores/sider.repository'
import { setProps } from '@ngneat/elf'

/**
 * Call 'editorLeftSidebarRefresh' event on component mount to query required data.
 *
 * TODOS:
 * [] draft-entries sort by ?
 */
const SidebarEl = forwardRef<
  HTMLDivElement,
  {
    backgroundColor?: string
    onMouseEnter: (e: React.MouseEvent) => void
  }
>((props, ref): JSX.Element | null => {
  const { backgroundColor, onMouseEnter } = props,
    [sidebar] = useObservable(editorRepo.leftSidebar$, {
      initialValue: null,
    }),
    [isOpen] = useObservable(siderRepo.isOpen$),
    [isPinned] = useObservable(siderRepo.isPinned$),
    div = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => div.current as HTMLDivElement)

  function onResize() {
    if (window && window.innerWidth < 769) {
      siderRepo.update(setProps({ isOpen: false, isPinned: false }))
    }
  }

  function onTouchStart(e: TouchEvent) {
    if (isOpen && !div.current?.contains(e.target as HTMLElement)) {
      siderRepo.update(setProps({ isOpen: false, isPinned: false }))
    }
  }

  useEffect(() => {
    editorLeftSidebarRefresh()

    window.addEventListener('resize', onResize)
    window.addEventListener('touchstart', onTouchStart, false)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('touchstart', onTouchStart)
    }
  }, [])

  if (sidebar === null) return null

  return (
    <div
      id="sider"
      ref={div}
      className={`
          [grid-area:sider]
          absolute left-0 
          z-50
          flex flex-col flex-shrink-0  
          w-72 
          h-full
          pt-8
          border-r 
          transition-all 
          duration-300
          ease-in-out
          ${
            isOpen
              ? ' translate-x-0 translate-y-0 '
              : '-translate-x-full translate-y-0 '
          } 
          ${
            isPinned
              ? `sm:relative border-gray-200  dark:bg-gray-800 ${
                  backgroundColor ? backgroundColor : 'bg-gray-100'
                }`
              : ' mt-2 h-[calc(100%_-_40px)] border-t rounded-r border-gray-100 bg-gray-50 '
          } 
          ${isPinned || !isOpen ? 'shadow-transparent' : 'shadow-2xl'}
            `}
      // onMouseEnter={() => {
      //   if (!isPinned) {
      //     clearTimeout(timeoutRef.current)
      //   }
      // }}
      onMouseEnter={e => onMouseEnter(e)}
    >
      {/* <div className="group absolute justify-end flex-shrink-0 w-full top-0 right-0 mr-2 mt-2 text-right">
          <span
            className={`
              hidden md:inline-block 
              ${isPined ? 'material-icons' : 'material-icons-outlined'} 
              bg-transparent 
              text-gray-400 dark:text-gray-500 
              cursor-pointer 
              hover:text-gray-600 dark:hover:text-gray-400
              opacity-0 group-hover:opacity-100 
              rotate-45 
              select-none`}
            onClick={() => {
              pinMenuHandler()
            }}
          >
            push_pin
          </span>
          <span
            className={`material-icons md:hidden text-gray-6  00 rounded-full bg-transparent
            cursor-pointer select-none`}
            onClick={() => {
              setIsOpen(false)
            }}
          >
            close
          </span>
        </div> */}

      {/* <DocIndexSection title="Committed" indexArray={committedDocIndicies} /> */}

      <SidebarSection title="EDIT" items={sidebar.items} />
    </div>
  )
})

SidebarEl.displayName = 'SidebarEl'

export default SidebarEl
