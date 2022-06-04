import React, { useState } from 'react'
import HotListItem from '../_hot-list-item'
import { List } from '../ui-component/list'
import { Box } from '../ui-component/box'
import { ListItem } from '../ui-component/list-item'
import Link from 'next/link'
import { styleSymbol } from '../ui-component/style-fc/style-symbol'
import moment from 'moment'

type Hashtags = '#討論' | '#機會' | '#Battle' | '#事件'

interface ListElement {
  title: string
  href: string
  source: string
  hashtags: Array<Hashtags>
}

const dummyList: ListElement[] = [
  {
    title: '原油 vs 天然氣，哪個比較適合投資？',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#討論'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#討論', '#機會'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#Battle'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#Battle', '#事件'],
  },
  {
    title: '原油 vs 天然氣，哪個比較適合投資？',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#討論'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#討論', '#機會'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#Battle'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#Battle', '#事件'],
  },
]

const orderOptions = [
  { label: '依熱門度', value: 'popularity' },
  { label: '最後更新時間(新->舊)', value: 'newToOld' },
]

function isHashtags(tag: string): tag is Hashtags {
  return ['#討論', '#機會', '#Battle', '#事件'].includes(tag)
}

const filtertags = ['全部', '#討論', '#機會', '#Battle', '#事件']

const HotDisplay = () => {
  const [listData, setListData] = useState<ListElement[]>(dummyList)
  const [currentTab, setCurrentHashtag] = useState(filtertags[0])

  const handleFilter = (tag: string) => {
    if (tag === '全部') {
      setListData(dummyList)
      setCurrentHashtag(tag)
    } else if (isHashtags(tag)) {
      const newList = JSON.parse(JSON.stringify(dummyList)) as ListElement[]
      setListData(newList.filter(e => e.hashtags.includes(tag)))
      setCurrentHashtag(tag)
    }
  }
  return (
    <Box padding="md">
      {listData.map(({ href, title, hashtags, source }, i) => {
        return (
          <ListItem key={i}>
            <span className="material-icons-outlined text-gray-300 dark:text-gray-500">
              tag
            </span>
            <div className="flex-grow">
              <Link href={href}>
                <a className="m-0 line-clamp-2">
                  <h4 className="mt-0 text-gray-700 dark:text-gray-200 hover:underline-offset-2 hover:underline">
                    {title}
                  </h4>
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
          </ListItem>
        )
      })}
      {/* <List listData={listData} currentTab={currentTab} /> */}
    </Box>
  )
}
export default HotDisplay
