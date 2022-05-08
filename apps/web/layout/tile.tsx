import moment from 'moment'
import React, { ReactNode } from 'react'
import { useDiscussPostsQuery, useMeQuery } from '../apollo/query.graphql'

export const Tile = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => {
  return (
    <div
      className={`p-3 rounded border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}
