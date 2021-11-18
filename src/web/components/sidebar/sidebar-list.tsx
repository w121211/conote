import React, { useState } from 'react'
import SidebarListContent from './sidebar-list-content'
import classes from './sidebar-list.module.scss'

const SidebarList = ({ title }: { title?: string }) => {
  const [showMore, setShowMore] = useState(true)
  return (
    <ul className={classes.sideList}>
      {title && (
        <div className={classes.divider}>
          {title}
          {showMore ? (
            <span className="material-icons" onClick={() => setShowMore(false)}>
              expand_less
            </span>
          ) : (
            <span className="material-icons" onClick={() => setShowMore(true)}>
              expand_more
            </span>
          )}
        </div>
      )}
      {title && showMore && (
        <SidebarListContent
          title={[
            { text: 'https://www.youtube.com/watch?v=CGa13i4zZA0', children: ['$AA', '[[事件哈哈]]', '$IPOE'] },
            { text: '$BB' },
            { text: '$CC' },
          ]}
        />
      )}
    </ul>
  )
}
export default SidebarList
