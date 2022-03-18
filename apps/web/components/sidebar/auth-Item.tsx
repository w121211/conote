import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useMeQuery } from '../../apollo/query.graphql'
import Tooltip from '../../layout/tooltip/tooltip'

const AuthItem = () => {
  const [showToolTip, setShowToolTip] = useState(false)
  const { data, loading } = useMeQuery({ fetchPolicy: 'network-only' })
  const router = useRouter()

  if (loading) {
    return null
  }

  return (
    <React.Fragment>
      <div className=" relative">
        {data?.me ? (
          <div className=" flex items-center mb-2 hover:cursor-pointer">
            <Link href={`/user/${data.me.id}`}>
              <a className="flex-1 min-w-0 flex items-center py-2 pl-4 rounded-r hover:bg-gray-200">
                <span className="material-icons mr-2 text-3xl leading-none text-gray-300 mix-blend-multiply">
                  account_circle
                </span>
                <span className=" truncate border-gray-200 text-gray-600 text-sm font-medium">{data.me.id}</span>
              </a>
            </Link>
            <button
              className="btn-reset-style group relative mr-4 ml-1 rounded  hover:bg-gray-200 "
              onClick={e => {
                e.stopPropagation()
                setShowToolTip(!showToolTip)
              }}
              onMouseEnter={e => {
                e.stopPropagation()
              }}
            >
              <span className="material-icons-outlined  leading-none text-gray-500 group-hover:text-gray-700">
                more_vert
              </span>
              <Tooltip
                className="mb-3 px-0 py-2"
                visible={showToolTip}
                onClose={() => setShowToolTip(false)}
                direction="top"
              >
                <Link href="/login">
                  <a className="px-4 text-gray-500 hover:bg-gray-100">登出</a>
                </Link>
              </Tooltip>
            </button>
          </div>
        ) : (
          <div className="px-4 pb-4">
            <button
              className="btn-primary w-full  "
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
