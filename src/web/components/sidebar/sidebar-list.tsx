import React, { useState } from 'react'
import { TreeNode } from '../../../packages/docdiff/src'
import { DocIndex } from '../workspace/doc-index'
import ContentPanel from './content-panel'
import SidebarListContent from './sidebar-list-content'

const SidebarList = ({ title, entries }: { title?: string; entries: TreeNode<DocIndex>[] | null }): JSX.Element => {
  const [showMore, setShowMore] = useState(true)
  return (
    <div className="flex flex-col min-h-0 overflow-hidden">
      {title && (
        <div
          className={`group flex justify-between items-center px-2 text-sm text-gray-700 font-bold 
          tracking-wide leading-7 cursor-pointer select-none  hover:bg-gray-200 
          `}
          onClick={() => setShowMore(!showMore)}
        >
          <div className="flex items-center">
            {showMore ? (
              <span className="material-icons">expand_more</span>
            ) : (
              <span className="material-icons">chevron_right</span>
            )}
            <span className="flex items-center gap-1">
              {title}
              <span className="text-gray-500 font-normal">
                {entries && entries.length > 0 ? '(' + entries.length + ')' : '(' + 0 + ')'}
              </span>
            </span>
          </div>
          {title === '暫存區' && <ContentPanel />}
        </div>
      )}
      {title && entries && entries?.length > 0
        ? showMore && <SidebarListContent entries={entries} />
        : showMore && (
            <span className="px-4 inline-block text-sm text-gray-400 text-center italic text-shadow">尚無筆記</span>
          )}
    </div>
  )
}
export default SidebarList
