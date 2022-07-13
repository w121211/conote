import { sumBy } from 'lodash'
import React, { useState } from 'react'
import type { NoteDraftEntryFragment } from '../../../../../../apollo/query.graphql'
import SidebarItemChain from './sidebar-item-chain'

const SidebarSection = ({
  chains,
  title,
}: {
  chains: NoteDraftEntryFragment[][]
  title: string
}): JSX.Element => {
  const [folded, setFolded] = useState(false),
    chains_ = chains.map(e => {
      if (e.length === 0) throw new Error('Chain length is 0')
      return {
        first: e[0],
        rest: e.slice(1),
      }
    })

  return (
    <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
      <div className="flex flex-col min-h-0 overflow-hidden">
        <div
          className={`group flex justify-between items-center 
            px-2 
            text-sm 
            text-gray-700 dark:text-gray-300 
            tracking-wide leading-7 
            cursor-pointer select-none  
            hover:bg-gray-200 dark:hover:bg-gray-600/70
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
              <span className="px-2 rounded-full text-xs leading-normal bg-gray-400 text-white font-medium ">
                {sumBy(chains, e => e.length)}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* {items.length > 0
        ? !folded && items.map(e => <SidebarItem key={e.id} item={e} />)
        : !folded && (
            <span className="px-4 inline-block text-sm text-gray-400 text-center italic text-shadow ">
              no note :{'('}
            </span>
          )} */}

      {chains_.length > 0
        ? !folded &&
          chains_.map(({ first, rest }) => (
            <SidebarItemChain
              key={first.id}
              itemFirst={first}
              itemsRest={rest}
            />
          ))
        : !folded && (
            <span className="px-4 inline-block text-sm text-gray-400 text-center italic text-shadow ">
              {'empty box :('}
            </span>
          )}
    </div>
  )
}

export default SidebarSection
