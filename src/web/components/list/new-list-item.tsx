import React from 'react'
import Link from 'next/link'
import CardEmojis from '../emoji-up-down/card-emojis-display'

const NewListItem = ({
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
            <a className="text-blue-500 overflow-hidden whitespace-nowrap text-ellipsis hover:underline hover:underline-offset-2">
              {author}
            </a>
          </Link>
        )}
        {/* {shot && <span className={classes.shot}>{shot}</span>} */}
        {/* {source && <div className={classes.source}>{source}</div>} */}

        {author && sourceUrl && <span className="h-4 mx-1 border-gray-300"></span>}
        {sourceUrl && (
          <a href={`${sourceUrl}`} className="truncate text-gray-500" rel="noreferrer" target="_blank">
            <span className="flex-shrink min-w-0 overflow-hidden whitespace-nowrap text-ellipsis hover:underline hover:underline-offset-2">
              {sourceUrl}
            </span>
          </a>
        )}
        {/* <div className={classes.lcElementHashtag}>$MU $TXN #up(10) </div> */}
      </div>
      <Link href={href}>
        <a className="overflow-hidden whitespace-nowrap text-ellipsis text-gray-700 hover:underline hover:underline-offset-2 ">
          <h3 className="m-0 truncate  text-xl">{title}</h3>
        </a>
      </Link>
      {summary && (
        <div className="mb-2 line-clamp-2 text-ellipsis text-sm text-gray-500">
          {summary.map((e, i) => {
            return (
              <span key={i} className="">
                {
                  <span className={`material-icons ${i > 0 ? 'ml-2' : 'ml-0'} text-xs leading-5 align-bottom`}>
                    fiber_manual_record
                  </span>
                }
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
                className={`my-0 last:mr-0 rounded text-sm text-blue-500 cursor-pointer ${
                  e === '#watch' ? 'bg-gray-600' : ''
                } ${currentHashtag === e ? 'text-blue-500' : ''}`}
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

export default NewListItem
