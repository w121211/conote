import React from 'react'
import Link from 'next/link'
import CardEmojis from '../emoji-up-down/card-emojis-display'

const NewList = ({
  href,
  title,
  sourceUrl,
  source,
  summary,
  hashtags,
  author,
  shot,
  currentHashtag,
  cardId,
}: {
  cardId: string
  href: string
  title: string
  sourceUrl?: string
  source?: string
  author?: string
  summary?: string[]
  hashtags?: string[]
  shot?: string
  currentHashtag?: string
}): JSX.Element => {
  return (
    <div className="overflow-hidden mt-6 mb-4 pb-4">
      <div className="flex mb-2 items-center text-sm">
        {author && (
          <Link href={`/author/${author}`}>
            <a className="text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis hover:underline hover:underline-offset-2">
              {author}
            </a>
          </Link>
        )}
        {/* {shot && <span className={classes.shot}>{shot}</span>} */}
        {/* {source && <div className={classes.source}>{source}</div>} */}

        {(author || hashtags || source) && <span className="h-4 mx-2 border-r border-gray-300"></span>}
        {sourceUrl && (
          <a
            href={`${sourceUrl}`}
            className="overflow-hidden whitespace-nowrap text-ellipsis"
            rel="noreferrer"
            target="_blank"
          >
            <span className="flex-shrink min-w-0 overflow-hidden whitespace-nowrap text-ellipsis text-gray-500 hover:underline hover:underline-offset-2">
              {sourceUrl}
            </span>
          </a>
        )}
        {/* <div className={classes.lcElementHashtag}>$MU $TXN #up(10) </div> */}
      </div>
      <Link href={href}>
        <a className="overflow-hidden whitespace-nowrap text-ellipsis text-blue-800 hover:underline hover:underline-offset-2 ">
          <h3 className="m-0 overflow-hidden whitespace-nowrap text-ellipsis text-xl">{title}</h3>
        </a>
      </Link>
      {summary && (
        <div className="mb-1 line-clamp-2 text-ellipsis text-sm text-gray-500">
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
      {/* {hashtags && source && <span className="mx-2 border-r border-gray-300"></span>} */}
      {hashtags && (
        <div className="flex">
          {hashtags.map((e, i) => {
            return (
              <span
                className={`my-0 last:mr-0 rounded text-sm text-blue-500 ${e === '#watch' ? 'bg-gray-600' : ''} ${
                  currentHashtag === e ? 'text-blue-500' : ''
                }`}
                key={i}
              >
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

export default NewList
