import moment from 'moment'
import React, { ReactNode } from 'react'
import { useDiscussPostsQuery, useMeQuery } from '../apollo/query.graphql'

export const Tile = ({ className, children }: { className?: string; children: ReactNode }) => {
  return <div className={`p-3 rounded border border-gray-200 bg-white shadow-sm ${className}`}>{children}</div>
}
