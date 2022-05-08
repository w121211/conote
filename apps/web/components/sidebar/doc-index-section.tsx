import React, { useState } from 'react'
import { TreeNode } from '@conote/docdiff'
import { DocIndex } from '../workspace/doc-index'
import DocIndexComponent from './doc-index-component'

const DocIndexSection = ({
  docIndicies,
  title,
}: {
  docIndicies: TreeNode<DocIndex>[]
  title: string
}): JSX.Element => {
  const [folded, setFolded] = useState(false)
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
            hover:bg-gray-200/70 dark:hover:bg-gray-600/70
          `}
          onClick={() => {
            setFolded(!folded)
          }}
        >
          <div className="flex items-center">
            {folded ? (
              <span className="material-icons">chevron_right</span>
            ) : (
              <span className="material-icons">expand_more</span>
            )}
            <span className="flex items-center gap-1 font-medium">
              {title}
              <span className=" px-2 rounded-full text-xs leading-normal bg-blue-500 text-white font-medium mix-blend-normal">
                {docIndicies.length}
              </span>
            </span>
          </div>
        </div>
      </div>

      {docIndicies?.length > 0
        ? !folded &&
          docIndicies.map((e, i) => <DocIndexComponent key={i} node={e} />)
        : !folded && (
            <span className="px-4 inline-block text-sm text-gray-400 text-center italic text-shadow ">
              no note :{'('}
            </span>
          )}
    </div>
  )
}
export default DocIndexSection
