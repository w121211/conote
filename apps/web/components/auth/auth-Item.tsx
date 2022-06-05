import React from 'react'
import Link from 'next/link'
import { useMe } from './use-me'
import ToggleMenu from '../ui-component/toggle-menu'
import { LoggedInUser } from './auth.service'

const AuthItem = () => {
  const { me, loading } = useMe()
  // const { data: me, loading } = useMeQuery()

  // if (loading) {
  //   return null
  // }
  return (
    <>
      {me ? (
        <ToggleMenu
          className=" py-1 -translate-x-full left-full"
          summary={
            <div className="flex items-center p-1 rounded hover:bg-gray-100">
              <span className="material-icons text-xl leading-none text-gray-500">
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
            <a className="block whitespace-nowrap px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 ">
              Your Profile
            </a>
          </Link>
          <div className="h-[1px] my-2 bg-gray-200"></div>
          <Link href="/login">
            <a className="block px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 ">
              Logout
            </a>
          </Link>
        </ToggleMenu>
      ) : (
        <a className="btn-primary  text-sm" href="/login">
          Login
        </a>
      )}
    </>
  )
}

export default AuthItem
