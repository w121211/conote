import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

const TabsWithSlider = ({
  tabs,
  tabListWidth,
  handleActiveList,
}: {
  tabs: string[]
  tabListWidth: number | null | undefined
  handleActiveList: (i: number) => void
}): JSX.Element => {
  const tabList = useRef<HTMLDivElement>(null)
  const tabSlider = useRef<HTMLDivElement>(null)
  const activeTabs = useRef<HTMLHeadingElement[]>([])
  const [activeTabIdx, setActiveTabIdx] = useState(0)
  const [listWidth, setListWidth] = useState(0)

  //   useEffect(() => {
  //     if (tabList.current?.getBoundingClientRect().width !== listWidth) {
  //       tabList.current && setListWidth(tabList.current?.getBoundingClientRect().width)
  //     }
  //     console.log(tabList.current?.getBoundingClientRect().width)
  //     //   tabList.current && setListWidth(tabList.current.getBoundingClientRect().width)
  //   })

  const moveSlider = (target: HTMLElement | HTMLHeadingElement) => {
    const rectTarget = target.getBoundingClientRect()
    const rectTabList = tabList.current?.getBoundingClientRect()
    if (tabSlider.current && rectTabList) {
      const sliderWidth = rectTarget.width / rectTabList.width
      const sliderPosition = rectTarget.left - rectTabList.left
      //   tabSlider.current.style.width = '100%'
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
    <div id="listContainer" className="relative " ref={tabList}>
      <div
        className="absolute bottom-[1px] left-0 right-0 origin-center-left border-t-2 border-blue-600 transition-all"
        ref={tabSlider}
      ></div>
      <div className="flex border-b border-gray-200">
        {tabs.map((tab, i) => {
          return (
            <h4
              key={i}
              ref={el => {
                if (el) {
                  activeTabs.current[i] = el
                }
                return el
              }}
              className={`px-4 py-2 font-normal font-bold ${
                activeTabIdx === i ? 'text-blue-600' : 'text-gray-500'
              } cursor-pointer `}
              onClick={e => {
                handleActiveList(i)
                setActiveTabIdx(i)
                moveSlider(e.target as HTMLElement)
              }}
            >
              {tab}
            </h4>
          )
        })}
      </div>
    </div>
  )
}

export default TabsWithSlider
