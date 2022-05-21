import Link from 'next/link'
import React, { useState } from 'react'
import { useMeQuery } from '../../apollo/query.graphql'
import ToggleMenu from '../ui-component/toggle-menu'

const MeHeaderItem = ({ className }: { className?: string }) => {
  const [showToolTip, setShowToolTip] = useState(false)
  const { data, loading, error } = useMeQuery({ fetchPolicy: 'network-only' })
  if (loading) {
    return null
  }
  if (!data || error) {
    return (
      <Link href="/login">
        <a>
          <button className="btn-primary h-10 capitalize">login</button>
        </a>
      </Link>
    )
  }
  return (
    <div className=" flex items-center hover:cursor-pointer">
      <Link href={`/user/${data.me.id}`}>
        <a className="flex-1 min-w-0 flex items-center p-1 rounded hover:bg-gray-100">
          <span className="material-icons text-3xl leading-none text-gray-300 mix-blend-multiply">
            account_circle
          </span>
          {/* <span className=" truncate border-gray-200 text-gray-600 text-sm font-medium">{data.me.id}</span> */}
        </a>
      </Link>
      <button
        className=" group relative "
        onClick={e => {
          e.stopPropagation()
          setShowToolTip(!showToolTip)
        }}
        onMouseEnter={e => {
          e.stopPropagation()
        }}
      >
        <ToggleMenu
          className="-translate-x-full left-full py-1"
          summary={
            <span className="material-icons-outlined  leading-none text-gray-400 group-hover:text-gray-600">
              arrow_drop_down
            </span>
          }
        >
          <Link href="/login">
            <a className="block whitespace-nowrap px-4 text-sm py-1 text-gray-500 hover:text-white hover:bg-blue-500">
              登出
            </a>
          </Link>
        </ToggleMenu>
        {/* <Tooltip
          className="mt-1 px-0 py-1"
          visible={showToolTip}
          onClose={() => setShowToolTip(false)}
          direction="bottom"
        >
          <Link href="/logout">
            <a className="px-4 text-sm py-1 text-gray-500 hover:bg-gray-100">登出</a>
          </Link>
        </Tooltip> */}
      </button>
    </div>
  )
}

export default MeHeaderItem
