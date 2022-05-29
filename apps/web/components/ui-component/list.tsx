import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { styleSymbol } from './style-fc/style-symbol'
import { Tile } from './tile'

type Hashtags = '#討論' | '#機會' | '#Battle' | '#事件'

export interface ListElement {
  title: string
  href: string
  source: string
  hashtags: Array<Hashtags>
}

export interface ListProps {
  listData: ListElement[]
  currentTab?: string
}

export const List = ({ listData, currentTab }: ListProps) => {
  return (
    <Tile>
      {listData.map(({ title, href, source, hashtags }, i) => {
        return (
          <div
            key={i}
            className="flex overflow-hidden min-w-0 pt-3 first:pt-0 pb-6  last:border-none border-b border-inherit first:rounded-t last:rounded-b"
          >
            <span className="material-icons-outlined text-gray-300 dark:text-gray-500">
              tag
            </span>
            <div className="flex-grow">
              <Link href={href}>
                <a className="m-0 line-clamp-2">
                  <h3 className=" text-gray-700 dark:text-gray-200 text-base font-medium hover:underline-offset-2 hover:underline">
                    {title}
                  </h3>
                </a>
              </Link>
              {hashtags && (
                <div className="mt-2 flex gap-1">
                  {hashtags.map((tag, i) => {
                    return (
                      <span
                        className={` px-1 last:mr-0 rounded text-xs text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-500 tracking-wide ${
                          currentTab === tag
                            ? 'text-blue-500 dark:text-blue-300'
                            : ''
                        }`}
                        key={i}
                      >
                        {/* {i > 0 && <span className="inline-block mx-1 font-[Arial]">·</span>} */}
                        {tag}
                      </span>
                    )
                  })}
                </div>
              )}
              <div className=" flex justify-end items-center gap-2 text-xs text-right">
                {source && (
                  <Link
                    href={{
                      pathname: `/note/[symbol]`,
                      query: { symbol: source },
                    }}
                  >
                    <a>
                      <span className="flex-shrink min-w-0 overflow-hidden whitespace-nowrap text-ellipsis text-blue-500 dark:text-blue-300 hover:underline hover:underline-offset-2">
                        {styleSymbol(source, '')}
                      </span>
                    </a>
                  </Link>
                )}

                {/* <span className="flex items-center gap-[2px] text-gray-500 ">
                  <span className="material-icons-outlined text-sm leading-none ">mode_comment</span>
                  <b>3</b>則回覆
                </span> */}
                <span className="text-gray-400">
                  {moment().subtract(10, 'days').calendar()}
                </span>
              </div>
              {/* {summary && (
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
      )} */}

              {/* <NoteEmojis noteId={noteId} /> */}
            </div>
          </div>
        )
      })}
    </Tile>
  )
}
