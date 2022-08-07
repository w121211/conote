import React, { useState } from 'react'
import { Box } from './ui-component/box'
import { ListItem } from './ui-component/list-item'
import Link from 'next/link'
import { styleSymbol } from './ui-component/style-fc/style-symbol'
import moment from 'moment'
import { DiscussFragment } from '../../apollo/query.graphql'
import { getNotePageURL } from '../utils'

interface Props {
  data: DiscussFragment[]
}

export const LatestDiscussTile = ({ data }: Props): JSX.Element => {
  return (
    <Box padding="md">
      {data.map(({ id, title, createdAt, noteEntries }) => {
        return (
          <ListItem key={id}>
            <span className="material-icons-outlined text-gray-300 dark:text-gray-500">
              tag
            </span>
            <div className="flex-grow">
              <Link
                href={{
                  pathname: '/discuss/[discussid]',
                  query: { discussid: id },
                }}
              >
                <a className="w-fit line-clamp-2">
                  <h4 className="text-gray-700 dark:text-gray-200 hover:underline-offset-2 hover:underline">
                    {title}
                  </h4>
                </a>
              </Link>
              {/* {hashtags && (
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
                        {tag}
                      </span>
                    )
                  })}
                </div>
              )} */}
              <div className="flex justify-end items-center gap-2 mt-2 text-sm text-right">
                {noteEntries.map(({ sym: { symbol } }, i) => (
                  <Link key={i} href={getNotePageURL(symbol)}>
                    <a>
                      <span className="flex-shrink min-w-0 overflow-hidden whitespace-nowrap text-ellipsis text-blue-500 dark:text-blue-300 hover:underline hover:underline-offset-2">
                        {styleSymbol(symbol, '')}
                      </span>
                    </a>
                  </Link>
                ))}
                <span className="text-gray-400">
                  {moment(createdAt).utc().format('ll')}
                </span>
              </div>
            </div>
          </ListItem>
        )
      })}
    </Box>
  )
}
