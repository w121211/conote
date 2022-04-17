import React, { forwardRef, ReactPropTypes, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { SearchAllForm } from '../search-all-form'
import DocIndexSection from './doc-index-section'
import { workspace } from '../workspace/workspace'
import { useObservable } from 'rxjs-hooks'
import { TreeNode, TreeService } from '@conote/docdiff'
import { DocIndex } from '../workspace/doc-index'
import { Doc } from '../workspace/doc'
import { useApolloClient } from '@apollo/client'
import { useMeQuery } from '../../apollo/query.graphql'
import { useRouter } from 'next/router'
import AuthItem from './auth-Item'
import Select from 'react-select'
import ChannelSelect from '../channel/channel-select'

const SideBar = ({
  showMenuHandler,
  pinMenuHandler,
  isPined,
  showSider,
}: {
  showMenuHandler: (boo?: boolean) => void
  pinMenuHandler: (boo?: boolean) => void
  isPined: boolean
  showSider: boolean
}): JSX.Element | null => {
  const editingdDocIndicies = useObservable(() => workspace.editingDocIndicies$)
  const ref = useRef<HTMLDivElement>(null)
  // const committedDocIndicies = useObservable(() => workspace.committedDocIndicies$)
  useEffect(() => {
    window.addEventListener('resize', () => {
      if (window && window.innerWidth < 769) {
        pinMenuHandler(false)
        showMenuHandler(false)
      }
    })
    window.addEventListener(
      'touchstart',
      e => {
        if (showSider && !ref.current?.contains(e.target as HTMLElement)) {
          showMenuHandler(false)
        }
      },
      false,
    )
  }, [])
  if (editingdDocIndicies === null) {
    return null
  }
  return (
    <>
      <div
        className={`absolute left-0 w-72 h-screen pt-0  border-gray-200 flex flex-col flex-shrink-0  transition-all shadow-l2xl
      ${showSider ? ' translate-x-0 translate-y-0 ' : '-translate-x-full translate-y-0 '} ${
          isPined ? 'sm:relative bg-gray-100' : 'z-50 bg-white'
        } ${isPined || !showSider ? 'shadow-transparent' : ''}
      `}
        onMouseLeave={() => {
          if (isPined) {
            return
          } else {
            showMenuHandler(false)
            pinMenuHandler(false)
          }
        }}
        ref={ref}
      >
        <div className="group flex-shrink-0 px-4">
          <div className="flex items-center justify-between h-11">
            <div className="flex items-center gap-1">
              <a href="/" className="py-1  rounded mix-blend-multiply ">
                Konote
              </a>
              <ChannelSelect />
            </div>
            <span
              className={`hidden md:block ${
                isPined ? 'material-icons' : 'material-icons-outlined'
              } text-gray-500 opacity-0 rounded-full bg-transparent hover:text-gray-600 
            cursor-pointer group-hover:opacity-100 rotate-45 select-none`}
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
                showMenuHandler(false)
              }}
            >
              close
            </span>
          </div>
        </div>
        <div className="mt-2 mb-3 mx-4">
          <SearchAllForm small />
        </div>
        {/* <DocIndexSection title="最近同步的筆記" indexArray={committedDocIndicies} /> */}
        <DocIndexSection title="暫存區" docIndicies={editingdDocIndicies} />
      </div>
    </>
  )
}

export default SideBar
