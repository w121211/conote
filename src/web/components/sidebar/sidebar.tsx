import React, { forwardRef, ReactPropTypes, useState } from 'react'
import Link from 'next/link'
import { SearchAllForm } from '../search-all-form'
import DocIndexSection from './doc-index-section'
import { workspace } from '../workspace/workspace'
import { useObservable } from 'rxjs-hooks'
import { TreeNode, TreeService } from '../../../packages/docdiff/src'
import { DocIndex } from '../workspace/doc-index'
import { Doc } from '../workspace/doc'
import { useApolloClient } from '@apollo/client'

const SideBar = ({
  showMenuHandler,
  pinMenuHandler,
  isPined,
  showMenu,
}: {
  showMenuHandler: (boo?: boolean) => void
  pinMenuHandler: (boo?: boolean) => void
  isPined: boolean
  showMenu: boolean
}): JSX.Element | null => {
  const editingdDocIndicies = useObservable(() => workspace.editingDocIndicies$)
  // const committedDocIndicies = useObservable(() => workspace.committedDocIndicies$)
  if (editingdDocIndicies === null) {
    return null
  }
  return (
    <div
      className={`absolute w-72 h-screen pt-0 pb-4 border-r border-gray-200 flex flex-col flex-shrink-0 z-50 transition-all 
      ${showMenu ? 'transform-gpu translate-x-0 translate-y-0' : 'transform-gpu -translate-x-full translate-y-0 '} ${
        isPined ? 'relative bg-gray-100' : 'absolute bg-white'
      } ${isPined || !showMenu ? 'shadow-none' : 'shadow-l2xl'}
      `}
      onMouseLeave={() => {
        if (isPined) {
          return
        }
        showMenuHandler(false)
        pinMenuHandler(false)
      }}
    >
      <div className="group flex-shrink-0 px-4">
        <div className="flex items-center justify-between h-11">
          <a href="/">Conote</a>
          <span
            className={`${
              isPined ? 'material-icons' : 'material-icons-outlined'
            } text-gray-600 opacity-0 hover:text-gray-500 cursor-pointer group-hover:opacity-100 transform rotate-45 select-none`}
            onClick={() => {
              pinMenuHandler()
            }}
          >
            push_pin
          </span>
        </div>
      </div>
      <div className="mt-2 mb-5">
        <SearchAllForm small />
      </div>
      {/* <DocIndexSection title="最近同步的筆記" indexArray={committedDocIndicies} /> */}
      <DocIndexSection title="暫存區" docIndicies={editingdDocIndicies} />
    </div>
  )
}

export default SideBar
