import React from 'react'
import classes from './sidebar-list-content.module.scss'

const SidebarListContent = ({ title }: { title: { text: string; children?: string[] }[] }) => {
  return (
    <div className={classes.listContent}>
      {title.map((e, i) => {
        return (
          <li key={i} className={classes.container}>
            <span className={classes.title}>
              <span className={`material-icons-outlined ${classes.articleIcon}`}>article</span>
              <span className={classes.titleText}>{e.text}</span>
            </span>
            {e.children && (
              <ul className={classes.children}>
                {e.children.map((el, idx) => {
                  // return <SidebarListContent title={[{ text: el }]} key={idx} />
                  return (
                    <li className={classes.listChild} key={idx}>
                      {el}
                    </li>
                  )
                })}
              </ul>
            )}
          </li>
        )
      })}
    </div>
  )
}
export default SidebarListContent
