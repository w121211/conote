import moment from 'moment'
import Link from 'next/link'
import React, { HtmlHTMLAttributes, ReactNode } from 'react'
import { styleSymbol } from './style-fc/style-symbol'
import { Box } from './box'

// type Hashtags = '#討論' | '#機會' | '#Battle' | '#事件'

// export interface ListElement {
//   title: string
//   href: string
//   source: string
//   hashtags: Array<Hashtags>
// }

// export interface ListProps {
//   listData: ListElement[]
//   currentTab?: string
// }

export const ListItem = ({
  children,
  onClick,
}: {
  children: ReactNode
  padding?: 'sm'
} & HtmlHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`
        flex 
        overflow-hidden 
        min-w-0 
        py-4 
        border-b border-inherit 
        first:pt-0 first:rounded-t
        last:pb-0 last:border-none last:rounded-b
        `}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
