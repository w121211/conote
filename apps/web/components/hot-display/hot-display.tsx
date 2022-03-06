import React, { useState } from 'react'
import HotListItem from '../hot-list-item'
import HotTabsWithSlider from './hot-tabs-with-slider'

type Hashtags = '#討論' | '#機會' | '#Battle' | '#事件'

interface ListElement {
  title: string
  href: string
  source: string
  hashtags: Array<Hashtags>
}

const dummyList: ListElement[] = [
  { title: '原油 vs 天然氣，哪個比較適合投資？', href: '#', source: '[[原油]]', hashtags: ['#討論'] },
  {
    title: '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#討論', '#機會'],
  },
  {
    title: '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#Battle'],
  },
  {
    title: '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#Battle', '#事件'],
  },
  { title: '原油 vs 天然氣，哪個比較適合投資？', href: '#', source: '[[原油]]', hashtags: ['#討論'] },
  {
    title: '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#討論', '#機會'],
  },
  {
    title: '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#Battle'],
  },
  {
    title: '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#Battle', '#事件'],
  },
]
function isHashtags(tag: string): tag is Hashtags {
  return ['#討論', '#機會', '#Battle', '#事件'].includes(tag)
}

const HotDisplay = ({ filtertags }: { filtertags: string[] }) => {
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
    <div>
      <div className="flex flex-wrap text-sm ">
        <HotTabsWithSlider tabs={filtertags} currentTab={currentTab} handleClickTab={handleFilter} />
        {/* {filtertags.map((tag, i) => {
          return (
            <span
              className={`mt-0 px-4 py-1 rounded hover:cursor-pointer ${
                currentTab === tag ? 'text-blue-600 ' : ' text-gray-500'
              }`}
              onClick={() => handleFilter(tag)}
              key={tag}
            >
              {tag}
            </span>
          )
        })} */}
      </div>
      <div className="mt-4">
        {listData.map((e, i) => {
          return (
            <HotListItem
              key={i}
              noteId={''}
              title={e.title}
              href={e.href}
              source={e.source}
              hashtags={e.hashtags}
              currentTab={currentTab}
            />
          )
        })}
      </div>
    </div>
  )
}
export default HotDisplay
