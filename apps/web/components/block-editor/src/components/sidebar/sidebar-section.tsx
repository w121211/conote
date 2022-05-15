import React, { useState } from 'react'
import { NoteDraftEntryFragment } from '../../../../../apollo/query.graphql'
import SidebarItem from './sidebar-item'

const SidebarSection = ({
  items,
  title,
}: {
  items: NoteDraftEntryFragment[]
  title: string
}): JSX.Element => {
  const [folded, setFolded] = useState(false)

  return (
    <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
      <div className="flex flex-col min-h-0 overflow-hidden">
        <div
          className={`group flex justify-between items-center px-2 text-sm text-gray-700 
          tracking-wide leading-7 cursor-pointer select-none  hover:bg-gray-200/70 mix-blend-multiply
          `}
          onClick={() => {
            setFolded(!folded)
          }}
        >
          <div className="flex items-center">
            {folded ? (
              <span className="material-icons ">chevron_right</span>
            ) : (
              <span className="material-icons">expand_more</span>
            )}
            <span className="flex items-center gap-1 font-medium">
              {title}
              <span className="px-2 rounded-full text-xs leading-normal bg-gray-400 text-white font-medium mix-blend-normal">
                {items.length}
              </span>
            </span>
          </div>
        </div>
      </div>

      {items.length > 0
        ? !folded && items.map(e => <SidebarItem key={e.id} item={e} />)
        : !folded && (
            <span className="px-4 inline-block text-sm text-gray-400 text-center italic text-shadow">
              Empty
            </span>
          )}
    </div>
  )
}

export default SidebarSection
