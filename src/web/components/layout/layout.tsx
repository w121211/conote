import React from 'react'
import SideBar from '../sidebar/sidebar'
import classes from './layout.module.scss'
import MenuIcon from '../../assets/svg/menu.svg'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useMeQuery } from '../../apollo/query.graphql'

export default function Layout({ children }: { children: React.ReactNode }) {
  // const { user, error, isLoading } = useUser()
  // const { data, loading } = useMeQuery()
  return (
    <div className={classes.layout}>
      <div className={classes.menuIconWrapper}>
        <MenuIcon className={classes.menuIcon} />
      </div>
      {/* <SideBar /> */}
      {children}
    </div>
  )
}
