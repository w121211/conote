import React, { useState } from 'react'
import HotListItem from '../hot-list-item'
import TabsWithSlider from '../../layout/tabs-with-slider'
import Select from 'react-select'
import { base } from '../../lib/fetcher/vendors/base'
import { List } from '../../layout/list'

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
    <div>
      {/* <div className="p-3  border-gray-200 rounded bg-white shadow">
        <div className="flex  text-sm">
          <TabsWithSlider tabs={filtertags} currentTab={currentTab} handleClickTab={handleFilter} />
          
        </div>
        <div className="flex items-center mt-3  text-gray-500">
          <span className="material-icons-outlined text-lg leading-none">swap_vert</span>
          <span className="mr-1 text-sm ">排序 : </span>
          <Select
            defaultValue={orderOptions[0]}
            options={orderOptions}
            isSearchable={false}
            components={{ IndicatorSeparator: null }}
            // menuIsOpen
            styles={{
              container: base => ({ ...base, flexGrow: 1 }),
              control: base => ({
                ...base,
                width: 'fit-content',
                minHeight: 'fit-content',
                fontSize: '14px',
                borderColor: 'rgb(229 231 235)',
                // ':hover': { borderColor: 'rgb(229 231 235)' },
                // borderColor: 'transparent',
                ':hover': { background: 'rgb(249 250 251)', borderColor: 'rgb(229 231 235)' },
                // boxShadow: '0 1px 6px 0 #17171730'
                // background: 'rgb(249 250 251)',
                boxShadow: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }),
              menu: base => ({
                ...base,
                width: 'fit-content',
                fontSize: '14px',
              }),
              option: base => ({ ...base, paddingTop: '4px', paddingBottom: '4px', cursor: 'pointer' }),
              singleValue: base => ({ ...base, color: 'rgb(107 114 128)' }),
              valueContainer: base => ({ ...base, paddingRight: 0 }),
              dropdownIndicator: (base, state) => ({
                ...base,
                display: 'flex',
                padding: '4px ',
                transform: 'scale(0.7)',
              }),
            }}
          />
        </div>
      </div> */}
      <List listData={listData} currentTab={currentTab} />
      {/* {listData.map((e, i) => {
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
        })} */}
    </div>
  )
}
export default HotDisplay
