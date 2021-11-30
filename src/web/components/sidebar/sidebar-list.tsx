import React, { useState } from 'react'
import { DocEntryPack } from '../workspace/doc'
import SidebarListContent from './sidebar-list-content'
import classes from './sidebar-list.module.scss'

const SidebarList = ({ title, entries }: { title?: string; entries: DocEntryPack[] | null }): JSX.Element => {
  const [showMore, setShowMore] = useState(true)
  return (
    <ul className={classes.sideList}>
      {title && (
        <div className={classes.divider} onClick={() => setShowMore(!showMore)}>
          <span className={classes.title}>
            {title + ' '}
            {showMore ? (
              <span className="material-icons">expand_less</span>
            ) : (
              <span className="material-icons">expand_more</span>
            )}
          </span>
          {entries && entries.length > 0 ? <span>{entries.length}</span> : <span>0</span>}
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
