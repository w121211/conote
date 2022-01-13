import React from 'react'
import Link from 'next/link'
import EmojiIcon from '../emoji-up-down/emoji-icon'

const AuthorArticleList = ({
  href,
  title,
  sourceUrl,
  summary,
  hashtags,
  author,
}: {
  href: string
  title: string
  sourceUrl?: string
  author?: string
  summary?: string
  hashtags?: string
}): JSX.Element => {
  return (
    <Link href={href}>
      <div className="flex justify-between  py-4 border-t last:border-b border-b-gray-200 overflow-hidden cursor-pointer">
        <a className="flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex flex-col">
              <h3 className="flex-shrink-0 truncate text-base text-gray-800 font-medium">{title}</h3>
              {summary && <span className="whitespace-nowrap text-gray-500 text-sm font-normal">{summary}</span>}
            </div>

            {author ? <div className="text-blue-500">{author}</div> : ''}
          </div>
        </a>
      </div>
    </Link>
  )
}

export default AuthorArticleList
