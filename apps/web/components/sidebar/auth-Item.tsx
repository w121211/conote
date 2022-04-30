import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useMeQuery } from '../../apollo/query.graphql'
import ToggleMenu from '../../layout/toggle-menu'
import Tooltip from '../../layout/tooltip/popup'

const AuthItem = () => {
  const { data, loading } = useMeQuery({ fetchPolicy: 'network-only' })
  const router = useRouter()

  if (loading) {
    return null
  }

  return (
    <React.Fragment>
      <div className=" relative">
        {data?.me ? (
          <ToggleMenu
            className="max-w-[120px] py-1 -translate-x-full left-full"
            summary={
              <div className="flex items-center p-1 rounded hover:bg-gray-100">
                <span className="material-icons text-xl leading-none text-blue-300 mix-blend-multiply">
                  account_circle
                </span>
                <span className="material-icons-outlined text-base leading-none text-gray-400 group-hover:text-gray-600">
                  arrow_drop_down
                </span>
              </div>
            }
          >
            <span className="block px-2  truncate  text-gray-600 text-sm font-medium cursor-default">
              {data.me.id}
            </span>
            <div className="h-[1px] my-2 bg-gray-200"></div>
            <Link
              href={{
                pathname: '/user/[userId]',
                query: { userId: data.me.id },
              }}
            >
              <a className="block px-2 py-1 text-sm text-gray-600 hover:bg-blue-500 hover:text-white">
                個人頁面
              </a>
            </Link>
            <div className="h-[1px] my-2 bg-gray-200"></div>
            <Link href="/login">
              <a className="block px-2 py-1 text-sm text-gray-600 hover:bg-blue-500 hover:text-white">
                登出
              </a>
            </Link>
          </ToggleMenu>
        ) : (
          <div className="">
            <button
              className="btn-primary px-2 py-[3px] text-sm"
              onClick={() => {
                router.push('/login')
              }}
            >
              登入
            </button>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

export default AuthItem
