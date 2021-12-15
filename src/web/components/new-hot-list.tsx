import React, { useRef, useState } from 'react'
import { LatestCards } from '../pages'
import IndexHotList from './index-hot-list/index-hot-list'
import TabsWithSlider from './tabs-with-slider'

const NewHotList = () => {
  const [activeList, setActiveList] = useState(0)
  const listContainer = useRef<HTMLDivElement>(null)
  return (
    <div className="max-w-xl flex-grow flex-shrink min-w-0" ref={listContainer}>
      <TabsWithSlider
        tabs={['最新', '熱門']}
        tabListWidth={listContainer.current?.getBoundingClientRect().width}
        handleActiveList={i => setActiveList(i)}
      />
      {activeList === 0 && <LatestCards />}
      {activeList === 1 && <IndexHotList />}
    </div>
  )
}

export default NewHotList
