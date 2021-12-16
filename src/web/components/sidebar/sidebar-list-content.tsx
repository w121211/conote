import Link from 'next/link'
import React from 'react'
import { DocEntryPack } from '../workspace/doc'

const SidebarListContent = ({ entries }: { entries: DocEntryPack[] }): JSX.Element => {
  return (
    <div className="overflow-hidden hover:overflow-y-auto">
      {entries.map((e, i) => (
        <div key={i} className="text-sm list-none">
          <li className="text-gray-700">
            <span className="flex items-center gap-1 pl-8 pr-4 leading-relax hover:bg-gray-200 cursor-pointer ">
              <span className="material-icons-outlined text-lg text-gray-400">article</span>
              <Link href={`/card/${encodeURIComponent(e.main.symbol)}`}>
                <a className="inline-block min-w-0 flex-1 truncate">{e.main.entry?.title || e.main.symbol}</a>
              </Link>
            </span>

            {e.subs.length > 0 && (
              <ul className="p-0">
                {e.subs.map((el, idx) => {
                  // return <SidebarListContent title={[{ text: el }]} key={idx} />
                  return (
                    <div key={idx} className="pl-10 hover:bg-gray-200 cursor-pointer ">
                      <li className="flex items-center pl-2 border-l border-gray-300 mix-blend-multiply">
                        <span className={`material-icons text-lg text-gray-400`}>notes</span>
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
