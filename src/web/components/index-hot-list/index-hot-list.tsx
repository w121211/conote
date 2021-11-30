import React, { useState } from 'react'
import ListLarge from '../list-large/list-large'
import classes from './index-hot-list.module.scss'

type Hashtags = '#討論' | '#機會' | '#Battle' | '#事件'

interface ListElement {
  title: string
  href: string
  source: string
  hashtags: Array<Hashtags>
}

const IndexHotList = () => {
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
  ]
  function isHashtags(tag: string): tag is Hashtags {
    return ['#討論', '#機會', '#Battle', '#事件'].includes(tag)
  }

  const [listData, setListData] = useState<ListElement[]>(dummyList)
  const [currentHashtag, setCurrentHashtag] = useState('')

  const handleFilter = (tag: string) => {
    if (tag === '全部') {
      setListData(dummyList)
      setCurrentHashtag('')
    } else if (isHashtags(tag)) {
      const newList = JSON.parse(JSON.stringify(dummyList)) as ListElement[]
      setListData(newList.filter(e => e.hashtags.includes(tag)))
      setCurrentHashtag(tag)
    }
  }
  return (
    <div>
      <div className={classes.filtertagsContainer}>
        <h4
          className={`${classes.subTitle} ${currentHashtag === '' ? classes.selected : ''}`}
          onClick={() => handleFilter('全部')}
        >
          全部
        </h4>
        <h4
          className={`${classes.subTitle} ${currentHashtag === '#討論' ? classes.selected : ''}`}
          onClick={() => handleFilter('#討論')}
        >
          #討論
        </h4>
        <h4
          className={`${classes.subTitle} ${currentHashtag === '#機會' ? classes.selected : ''}`}
          onClick={() => handleFilter('#機會')}
        >
          #機會
        </h4>
        <h4
          className={`${classes.subTitle} ${currentHashtag === '#Battle' ? classes.selected : ''}`}
          onClick={() => handleFilter('#Battle')}
        >
          #Battle
        </h4>
        <h4
          className={`${classes.subTitle} ${currentHashtag === '#事件' ? classes.selected : ''}`}
          onClick={() => handleFilter('#事件')}
        >
          #事件
        </h4>
      </div>
      {listData.map((e, i) => {
        return (
          <ListLarge
            key={i}
            cardId={''}
            title={e.title}
            href={e.href}
            source={e.source}
            hashtags={e.hashtags}
            currentHashtag={currentHashtag}
          />
        )
      })}
      {/* <ListLarge
                        title="原油 vs 天然氣，哪個比較適合投資？"
                        href="#"
                        source="[[原油]]"
                        hashtags={['#討論']}
                      />
                      <ListLarge
                        title="全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI
                            #多 @匿名)"
                        href="#"
                        source="[[原油]]"
                        hashtags={['#討論', '#機會']}
                      /> */}
    </div>
  )
}
export default IndexHotList
