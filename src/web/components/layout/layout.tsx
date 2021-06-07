import React from 'react'
import SideBar from '../sidebar/sidebar'
import classes from './layout.module.scss'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useMeQuery } from '../../apollo/query.graphql'

export default function Layout({ children }: { children: React.ReactNode }) {
  // const { user, error, isLoading } = useUser()
  // const { data, loading } = useMeQuery()
  return (
    <div className={classes.layout}>
      {/* {data && user ? (
        <>
          Welcome {data.me.id}! <a href="/api/auth/logout">Logout</a>
        </>
      ) : (
        <a href="/api/auth/login">Login</a>
      )} */}
      <SideBar />
      {children}
    </div>
  )
}
