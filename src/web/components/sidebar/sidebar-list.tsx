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
          {title}
          {showMore ? (
            <span className="material-icons">expand_less</span>
          ) : (
            <span className="material-icons">expand_more</span>
          )}
        </div>
      )}
      {title && showMore && entries && <SidebarListContent entries={entries} />}
    </ul>
  )
}
export default SidebarList
