import React from 'react'
import Link from 'next/link'
import ToggleMenu from '../ui-component/toggle-menu'
import { LoggedInUser } from './auth.service'
import LogoutButton from './logout-button'
import { DropdownListDivider } from '../ui-component/dropdown-list-divider'
import { useMeContext } from './use-me-context'
import { getLoginPageURL } from '../../utils'
import { useRouter } from 'next/router'

const AuthItem = () => {
  const router = useRouter(),
    { me, loading } = useMeContext()

  // if (loading) return null

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
          <span className="block px-2 truncate text-gray-600 text-sm font-medium cursor-default">
            {me.id}
          </span>
          <DropdownListDivider />
          <Link
            href={{
              pathname: '/user/[userId]',
              query: { userId: me.id },
            }}
          >
            <a className="dropdown-list-item">Your Profile</a>
          </Link>
          <DropdownListDivider />
          <Link href={getLoginPageURL()}>
            <a className="dropdown-list-item">Logout</a>
          </Link>
        </ToggleMenu>
      ) : (
        <a className="btn-primary text-sm" href={getLoginPageURL(router)}>
          Login
        </a>
      )}
    </>
  )
}

export default AuthItem
