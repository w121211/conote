import Link from 'next/link'
import React from 'react'
import { DocEntryPack } from '../workspace/doc'
import classes from './sidebar-list-content.module.scss'

const SidebarListContent = ({ entries }: { entries: DocEntryPack[] }): JSX.Element => {
  console.log(entries)
  return (
    <div className={classes.container}>
      {entries.map((e, i) => (
        <div key={i} className={classes.listContainer}>
          <li className={classes.listContent}>
            <span className={classes.title}>
              <span className={`material-icons-outlined ${classes.articleIcon}`}>article</span>
              <Link href={`/cardx/${encodeURIComponent(e.main.symbol)}`}>
                <a className={classes.titleText}>{e.main.entry?.title || e.main.symbol}</a>
              </Link>
            </span>

            {e.subs.length > 0 && (
              <ul className={classes.children}>
                {e.subs.map((el, idx) => {
                  // return <SidebarListContent title={[{ text: el }]} key={idx} />
                  return (
                    <div key={idx} className={classes.listChildWrapper}>
                      <li className={classes.listChild}>
                        <span className={`material-icons ${classes.notesIcon}`}>notes</span>
                        <span>{el.title}</span>
                      </li>
                    </div>
                  )
                })}
              </ul>
            )}
          </li>
          {/* <ul className={classes.children}>
            <div className={classes.listChildWrapper}>
              <li className={classes.listChild}>
                <span className={`material-icons ${classes.notesIcon}`}>notes</span>
                <span>測試</span>
              </li>
            </div>
            <div className={classes.listChildWrapper}>
              <li className={classes.listChild}>
                <span className={`material-icons ${classes.notesIcon}`}>notes</span>
                <span>測試</span>
              </li>
            </div>
          </ul> */}
        </div>
      ))}
    </div>
  )
}
export default SidebarListContent
