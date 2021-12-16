import React from 'react'
import Link from 'next/link'

const ListRow = ({
  href,
  title,
  sourceUrl,
  summary,
  hashtags,
  author,
  shot,
}: {
  href: string
  title: string
  sourceUrl?: string
  author?: string
  summary?: string
  hashtags?: string
  shot?: string
}): JSX.Element => {
  return (
    <div className="flex  mb-2 pb-2 border-b border-b-gray-300 overflow-hidden">
      <Link href={href}>
        {/* <a>{e.link.url.substring(0, 50).replace('//', '').replace('[[', '').replace(']]', '')}</a> */}
        <a className="flex items-center justify-between overflow-hidden">
          {/* <div> */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {shot && (
              <span
                className={`px-2 rounded text-white ${
                  shot.match('buy') ? 'bg-green-700' : shot.match('sell') ? 'bg-rose-700' : 'bg-yellow-700'
                }`}
              >
                {shot}
              </span>
            )}

            {/* {sourceUrl && (
                <div className={classes.url}>
                <span className={classes.topDivider}></span> {sourceUrl}
                </div>
              )} */}
            {/* <div className={classes.lcElementHashtag}>$MU $TXN #up(10) </div> */}
            <div className="flex flex-col">
              <h3 className="flex-shrink-0 overflow-hidden whitespace-nowrap text-ellipsis text-blue-800">{title}</h3>
              {summary && <span className="whitespace-nowrap text-gray-500 text-sm font-normal">{summary}</span>}
            </div>

            {author ? <div className="text-blue-500">{author}</div> : ''}
          </div>
          {/* </div> */}
        </a>
      </Link>
      <div className="flex">
        <span>👍22</span>
        <span>👎10</span>
      </div>
    </div>
  )
}

export default ListRow
