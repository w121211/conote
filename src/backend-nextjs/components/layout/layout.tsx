import React from 'react'
import SideBar from '../sidebar/sidebar'
import classes from './layout.module.scss'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={classes.layout}>
      <SideBar />
      {children}
    </div>
  )
}
