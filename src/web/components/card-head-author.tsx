import Link from 'next/link'
import React from 'react'

const CardHeadAuthor = ({ author }: { author: string }) => {
  return (
    <Link href={`/author/${encodeURIComponent('@' + author)}`}>
      <a className="mr-4 text-sm text-gray-500 hover:underline hover:underline-offset-2">@{author}</a>
    </Link>
  )
}
export default CardHeadAuthor
