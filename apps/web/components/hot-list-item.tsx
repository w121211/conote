import React from 'react'
import Link from 'next/link'
import NoteEmojis from './emoji-up-down/_note-emojis-display'

const HotListItme = ({
  href,
  title,
  source,
  summary,
  hashtags,
  author,
  shot,
  currentTab,
  noteId,
}: {
  noteId: string
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
    <div className="overflow-hidden px-2 py-4 border-b  border-gray-200 first:rounded-t last:rounded-b">
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
          <Link href={{ pathname: `/note/[symbol]`, query: { symbol: source } }}>
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
        <a className="truncate">
          <h3 className="m-0 truncate text-gray-700 text-lg hover:underline-offset-2 hover:underline">{title}</h3>
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

      {/* <NoteEmojis noteId={noteId} /> */}
    </div>
  )
}

export default HotListItme
