import React from 'react'
import Link from 'next/link'
import { useMeContext } from './use-me-context'
import { getLoginPageURL } from '../../utils'
import { useRouter } from 'next/router'
import Popover from '../ui/Popover'

const menuItemClass =
  'block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'

const AuthDropdownMenu = () => {
  const router = useRouter(),
    { me } = useMeContext()

  if (me === null) {
    return (
      <a className="btn-primary text-sm" href={getLoginPageURL(router)}>
        Login
      </a>
    )
  }
  return (
    <div className="hs-dropdown relative inline-flex">
      <Popover
        render={({ close, labelId, descriptionId }) => (
          <>
            <div
              className="z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
              aria-labelledby="hs-dropdown-with-icons"
            >
              <ul
                className="py-1 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownInformationButton"
              >
                <li>
                  <Link
                    href={{
                      pathname: '/user/[userId]',
                      query: { userId: me.id },
                    }}
                  >
                    <a className={menuItemClass} onClick={close}>
                      Profile
                    </a>
                  </Link>
                </li>
                <li>
                  <Link
                    href={{
                      pathname: '/user/commits/[userid]',
                      query: { userid: me.id },
                    }}
                  >
                    <a className={menuItemClass} onClick={close}>
                      Your commits
                    </a>
                  </Link>
                </li>
                <li>
                  <Link
                    href={{
                      pathname: '/user/discussions/[userid]',
                      query: { userid: me.id },
                    }}
                  >
                    <a className={menuItemClass} onClick={close}>
                      Your discussions
                    </a>
                  </Link>
                </li>
              </ul>
              <div className="py-1">
                <Link href={getLoginPageURL()}>
                  <a
                    className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    onClick={close}
                  >
                    Logout
                  </a>
                </Link>
              </div>
            </div>
          </>
        )}
      >
        <button className="flex items-center p-1 rounded hover:bg-gray-100">
          <span className="material-icons-outlined leading-none text-gray-500">
            account_circle
          </span>
          <span className="material-icons-outlined text-base leading-none text-gray-400 group-hover:text-gray-600">
            arrow_drop_down
          </span>
        </button>
      </Popover>
    </div>
  )
}

export default AuthDropdownMenu
