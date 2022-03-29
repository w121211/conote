import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

const TabsWithSlider = ({
  tabs,
  handleClickTab,
  currentTab,
}: {
  tabs: string[]
  currentTab: string
  handleClickTab: (tab: string) => void
}): JSX.Element => {
  const tabList = useRef<HTMLDivElement>(null)
  const tabSlider = useRef<HTMLDivElement>(null)
  const activeTabs = useRef<HTMLHeadingElement[]>([])
  const [activeTabIdx, setActiveTabIdx] = useState(0)
  const [listWidth, setListWidth] = useState(0)

  const moveSlider = (target: HTMLElement | HTMLHeadingElement) => {
    const rectTarget = target.getBoundingClientRect()
    const rectTabList = tabList.current?.getBoundingClientRect()
    if (tabSlider.current && rectTabList) {
      const sliderWidth = rectTarget.width / rectTabList.width
      const sliderPosition = rectTarget.left - rectTabList.left
      tabSlider.current.style.transform = `matrix(${sliderWidth},0,0,1,${sliderPosition},1)`
    }
  }

  useEffect(() => {
    /* detect tablist resize */
    const resizeObserver = new ResizeObserver(entries => {
      if (activeTabs.current[activeTabIdx]) {
        moveSlider(activeTabs.current[activeTabIdx])
      }
    })
    if (tabList.current) {
      resizeObserver.observe(tabList.current)
    }
    return () => {
      resizeObserver.disconnect()
    }
  }, [activeTabIdx])

  return (
    <div id="listContainer" className=" w-full h-full border-gray-200 overflow-x-auto hide-scrollbar  text-sm">
      <div className="relative flex gap-4 min-w-max w-full " ref={tabList}>
        {tabs.map((tab, i) => {
          return (
            <h4
              key={tab}
              ref={el => {
                if (el) {
                  activeTabs.current[i] = el
                }
                return el
              }}
              className={`flex-shrink-0 mt-0 px-2 pb-4 rounded tracking-widest font-normal hover:cursor-pointer ${
                currentTab === tab ? 'text-blue-600 ' : ' text-gray-500'
              }`}
              onClick={e => {
                handleClickTab(tab)
                setActiveTabIdx(i)
                moveSlider(e.target as HTMLElement)
              }}
            >
              {tab}
            </h4>
          )
        })}
        <div className="absolute flex-grow flex-shrink-0 w-full bottom-0 left-0  border-t border-gray-200"></div>
        <div
          className="absolute flex-grow flex-shrink-0 w-full bottom-[1px] left-0 right-0 origin-center-left border-t-2 border-blue-600 transition-all"
          ref={tabSlider}
        ></div>
      </div>
    </div>
  )
}

export default TabsWithSlider
