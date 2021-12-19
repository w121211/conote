import Link from 'next/link'
import React from 'react'
import { useMeQuery } from '../../__generated__/apollo/query.graphql'

const MeHeaderItem = ({ className }: { className?: string }) => {
  const { data, loading, error } = useMeQuery()
  if (!data || loading || error) {
    return (
      <Link href="/login">
        <a>
          <button className="btn-primary h-10 capitalize">login</button>
        </a>
      </Link>
    )
  }
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center">
        <button className=" h-10 hover:bg-gray-100">
          <span className="material-icons mr-1 text-red-600 text-lg">favorite</span>
          <span className="text-sm text-gray-700">我的收藏</span>
        </button>
      </div>
      <div className={`flex items-center text-gray-400 ${className ? className : ''}`}>
        <Link href="/login">
          <a>
            <button className="h-10 text-gray-700 capitalize hover:bg-gray-100">logout</button>
          </a>
        </Link>
        {/* <span className="material-icons">account_circle</span>
        <span className="material-icons">expand_more</span> */}
      </div>
    </div>
  )
}

export default MeHeaderItem
