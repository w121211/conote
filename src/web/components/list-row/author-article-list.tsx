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
  rate,
}: {
  href: string
  title: string
  sourceUrl?: string
  author?: string
  summary?: string
  hashtags?: string
  rate?: string
}): JSX.Element => {
  return (
    <div className="flex justify-between mb-4 pb-2  last:border-none border-b-gray-200 overflow-hidden">
      <Link href={href}>
        {/* <a>{e.link.url.substring(0, 50).replace('//', '').replace('[[', '').replace(']]', '')}</a> */}
        <a className="flex items-center justify-between overflow-hidden">
          {/* <div> */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {rate && (
              <span
                className={`px-2 rounded  ${
                  rate.match('LONG')
                    ? 'bg-green-100 text-green-700'
                    : rate.match('SHORT')
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {rate.replace('LONG', '看多').replace('SHORT', '看空').replace('HOLD', '觀望')}
              </span>
            )}

            {/* {sourceUrl && (
                <div className={classes.url}>
                <span className={classes.topDivider}></span> {sourceUrl}
                </div>
              )} */}
            {/* <div className={classes.lcElementHashtag}>$MU $TXN #up(10) </div> */}
            <div className="flex flex-col">
              <h3 className="flex-shrink-0 truncate text-base text-gray-800 font-medium">{title}</h3>
              {summary && <span className="whitespace-nowrap text-gray-500 text-sm font-normal">{summary}</span>}
            </div>

            {author ? <div className="text-blue-500">{author}</div> : ''}
          </div>
          {/* </div> */}
        </a>
      </Link>
      {/* <div className="flex items-center">
        <EmojiIcon code="UP" nUps={22} />
        <EmojiIcon code="DOWN" nUps={10} />
      </div> */}
    </div>
  )
}

export default AuthorArticleList
