import React, { useState } from 'react'
import { DocEntryPack } from '../workspace/doc'
import SidebarListContent from './sidebar-list-content'
import classes from './sidebar-list.module.scss'

const SidebarList = ({ title, entries }: { title?: string; entries: DocEntryPack[] | null }): JSX.Element => {
  const [showMore, setShowMore] = useState(true)
  return (
    <ul className={classes.sideList}>
      {title && (
        <div
          className={`flex items-center justify-between px-2 text-sm text-gray-700 font-bold tracking-wide leading-7 cursor-pointer select-none bg-gray-200 hover:bg-gray-300 mix-blend-multiply`}
          onClick={() => setShowMore(!showMore)}
        >
          <span className="flex items-center gap-1">
            {title}
            <span className="text-gray-500 font-normal">
              {entries && entries.length > 0 ? '(' + entries.length + ')' : '(' + 0 + ')'}
            </span>
          </span>
          {showMore ? (
            <span className="material-icons">expand_less</span>
          ) : (
            <span className="material-icons">expand_more</span>
          )}
        </div>
      )}
      {title && entries && entries?.length > 0 ? (
        <>{showMore && <SidebarListContent entries={entries} />}</>
      ) : (
        <>{showMore && <span className={classes.noNoteSpan}>尚無筆記</span>}</>
      )}
    </ul>
  )
}
export default SidebarList
