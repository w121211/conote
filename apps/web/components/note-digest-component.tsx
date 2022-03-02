import React from 'react'
import Link from 'next/link'
import { NoteDigestFragment } from '../apollo/query.graphql'
import { SymbolHelper } from '../common/symbol-helper'
import NoteEmojis from './emoji-up-down/note-emojis-display'

const NoteDigestComponent = ({ digest }: { digest: NoteDigestFragment }): JSX.Element => {
  const {
    // commitId,
    noteId,
    // fromNoteId,
    picks,
    // updatedAt,
    noteMeta: { author, keywords, title, url },
    sym,
    subSyms,
  } = digest
  return (
    <div className="overflow-hidden px-4 py-2 border-x border-b first:border-t border-gray-200 first:rounded-t last:rounded-b">
      <div className="flex  items-center text-sm">
        {author && (
          <Link href={`/author/${author}`}>
            <a className="text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis hover:underline hover:underline-offset-2">
              {author}
            </a>
          </Link>
        )}
        {/* {shot && <span className={classes.shot}>{shot}</span>} */}
        {/* {source && <div className={classes.source}>{source}</div>} */}

        {author && url && <span className="h-4 mx-1 border-gray-300"></span>}
        {url && (
          <a href={url} className="truncate text-gray-500" rel="noreferrer" target="_blank">
            <span className="flex-shrink min-w-0 overflow-hidden whitespace-nowrap text-ellipsis hover:underline hover:underline-offset-2">
              {url}
            </span>
          </a>
        )}
        {/* <div className={classes.lcElementHashtag}>$MU $TXN #up(10) </div> */}
      </div>
      <Link href={{ pathname: '/note/[symbol]', query: { symbol: sym.symbol } }}>
        <a className="  text-gray-700 hover:underline hover:underline-offset-2 ">
          <h3 className="truncate my-2 text-xl">
            {title ??
              (sym.symbol.startsWith('[[') && sym.symbol.endsWith(']]') ? (
                <>
                  <span className="text-gray-400 font-normal">[[</span>
                  {sym.symbol.substring(2, sym.symbol.length - 2)}
                  <span className="text-gray-400 font-normal">]]</span>
                </>
              ) : (
                sym.symbol
              ))}
          </h3>
        </a>
      </Link>
      {/* {picks.length > 0 && (
        <div className="mb-2 line-clamp-2 text-ellipsis text-sm text-gray-500">
          {picks.map((e, i) => {
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
      )} */}
      {/* {hashtags && source && <span className="mx-2 border-r border-gray-300"></span>} */}
      <div className="flex">
        {subSyms.map((e, i) => (
          <Link
            key={i}
            href={{ pathname: '/note/[symbol]', query: { symbol: e.symbol } }}
            // href={`/note/${encodeURIComponent(!e.startsWith('$') && !e.startsWith('#') ? `[[${e}]]` : e)}`}
          >
            <a
              className={`my-0 last:mr-0 rounded text-sm text-blue-500 cursor-pointer hover:underline hover:underline-offset-2`}
            >
              {i > 0 && <span className="inline-block mx-1 font-[Arial]">·</span>}
              {e.type === 'TOPIC' ? SymbolHelper.removeTopicPrefixSuffix(e.symbol) : e.symbol}
            </a>
          </Link>
        ))}
      </div>
      <NoteEmojis noteId={noteId} />
    </div>
  )
}

export default NoteDigestComponent
