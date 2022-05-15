import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ToggleMenu from '../../layout/toggle-menu'
import { useMe } from './use-me'

const AuthItem = () => {
  const router = useRouter(),
    { me, loading } = useMe()

  if (loading) {
    return null
  }
  return (
    <React.Fragment>
      <div className=" relative">
        {me ? (
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
              {me.id}
            </span>
            <div className="h-[1px] my-2 bg-gray-200"></div>
            <Link
              href={{
                pathname: '/user/[userId]',
                query: { userId: me.id },
              }}
            >
              <a className="block px-2 py-1 text-sm text-gray-600 hover:bg-blue-500 hover:text-white">
                Profile
              </a>
            </Link>
            <div className="h-[1px] my-2 bg-gray-200"></div>
            <Link href="/login">
              <a className="block px-2 py-1 text-sm text-gray-600 hover:bg-blue-500 hover:text-white">
                Logout
              </a>
            </Link>
          </ToggleMenu>
        ) : (
          // TODO: Change to button-like-link
          <div className="">
            <button
              className="btn-primary px-2 py-[3px] text-sm"
              onClick={() => {
                router.push('/login')
              }}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

export default AuthItem
