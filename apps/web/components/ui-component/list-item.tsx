import moment from 'moment'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import { styleSymbol } from './style-fc/style-symbol'
import { Box } from './box'

type Hashtags = '#討論' | '#機會' | '#Battle' | '#事件'

export interface ListElement {
  title: string
  href: string
  source: string
  hashtags: Array<Hashtags>
}

export interface ListProps {
  listData: ListElement[]
  currentTab?: string
}

export const ListItem = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex overflow-hidden min-w-0 pt-3 first:pt-0 pb-6  last:border-none border-b border-inherit first:rounded-t last:rounded-b">
      {children}
    </div>
  )
}
