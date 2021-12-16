import React from 'react'
import Link from 'next/link'
import CardEmojis from '../emoji-up-down/card-emojis-display'

const HotList = ({
  href,
  title,
  source,
  summary,
  hashtags,
  author,
  shot,
  currentTab,
  cardId,
}: {
  cardId: string
  href: string
  title: string
  source?: string
  author?: string
  summary?: string[]
  hashtags?: string[]
  shot?: string
  currentTab: string
}): JSX.Element => {
  return (
    <div className="overflow-hidden p-4 border border-t-0 first:border-t border-gray-200 first:rounded-t last:rounded-b">
      <div className="items-center text-sm">
        {hashtags && (
          <span className="">
            {hashtags.map((tag, i) => {
              return (
                <span
                  className={`my-0 last:mr-0 rounded text-sm text-gray-500 ${tag === '#watch' ? 'bg-gray-600' : ''} ${
                    currentTab === tag ? 'text-blue-500' : ''
                  }`}
                  key={i}
                >
                  {i > 0 && <span className="inline-block mx-1 font-[Arial]">·</span>}
                  {tag}
                </span>
              )
            })}
          </span>
        )}
        {hashtags && source && <div className="inline mx-2 border-r border-gray-300"></div>}
        {/* {author && (
          <Link href={`/author/${author}`}>
            <a className="text-blue-500 overflow-hidden whitespace-nowrap text-ellipsis hover:underline hover:underline-offset-2">
              {author}
            </a>
          </Link>
        )} */}
        {/* {shot && <span className={classes.shot}>{shot}</span>} */}
        {/* {source && <div className={classes.source}>{source}</div>} */}

        {/* {(author || hashtags || source) && <span className="h-4 mx-2 border-r border-gray-300"></span>} */}
        {source && (
          <Link href={`/card/${source}`}>
            <a>
              <span className="flex-shrink min-w-0 overflow-hidden whitespace-nowrap text-ellipsis text-blue-500 hover:underline hover:underline-offset-2">
                {source}
              </span>
            </a>
          </Link>
        )}
        {/* <div className={classes.lcElementHashtag}>$MU $TXN #up(10) </div> */}
      </div>
      <Link href={href}>
        <a className="overflow-hidden whitespace-nowrap text-ellipsis">
          <h3 className="m-0 overflow-hidden whitespace-nowrap text-ellipsis text-blue-800 text-lg hover:underline-offset-2 hover:underline">
            {title}
          </h3>
        </a>
      </Link>
      {summary && (
        <div className="mb-1 line-clamp-2 text-ellipsis text-sm">
          {summary.map((e, i) => {
            return (
              <span key={i}>
                {i > 0 && <span className="inline-block mx-1 font-[Arial]">·</span>}
                {e}
              </span>
            )
          })}
        </div>
      )}

      <CardEmojis cardId={cardId} />
    </div>
  )
}

export default HotList
