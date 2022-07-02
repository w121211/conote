import React, { useState } from 'react'
import { Box } from './ui-component/box'
import { ListItem } from './ui-component/list-item'
import Link from 'next/link'
import { styleSymbol } from './ui-component/style-fc/style-symbol'
import moment from 'moment'
import { DiscussFragment } from '../apollo/query.graphql'
import { getNotePageURL } from './page-utils'

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
                  <Link key={i} href={getNotePageURL('base', symbol)}>
                    <a>
                      <span className="flex-shrink min-w-0 overflow-hidden whitespace-nowrap text-ellipsis text-blue-500 dark:text-blue-300 hover:underline hover:underline-offset-2">
                        {styleSymbol(symbol, '')}
                      </span>
                    </a>
                  </Link>
                ))}
                <span className="text-gray-400">
                  {moment(createdAt).subtract(10, 'days').format('ll')}
                </span>
              </div>
            </div>
          </ListItem>
        )
      })}
    </Box>
  )
}

// type Hashtags = '#討論' | '#機會' | '#Battle' | '#事件'

// const orderOptions = [
//   { label: '依熱門度', value: 'popularity' },
//   { label: '最後更新時間(新->舊)', value: 'newToOld' },
// ]

// function isHashtags(tag: string): tag is Hashtags {
//   return ['#討論', '#機會', '#Battle', '#事件'].includes(tag)
// }

// const filtertags = ['全部', '#討論', '#機會', '#Battle', '#事件']

// const [listData, setListData] = useState<ListElement[]>(dummyList)
// const [currentTab, setCurrentHashtag] = useState(filtertags[0])

// const handleFilter = (tag: string) => {
//   if (tag === '全部') {
//     setListData(dummyList)
//     setCurrentHashtag(tag)
//   } else if (isHashtags(tag)) {
//     const newList = JSON.parse(JSON.stringify(dummyList)) as ListElement[]
//     setListData(newList.filter(e => e.hashtags.includes(tag)))
//     setCurrentHashtag(tag)
//   }
// }
