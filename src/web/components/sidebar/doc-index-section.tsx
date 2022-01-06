import React, { useState } from 'react'
import { TreeNode } from '../../../packages/docdiff/src'
import { DocIndex } from '../workspace/doc-index'
import DocIndexComponent from './doc-index-component'

const DocIndexSection = ({ docIndicies, title }: { docIndicies: TreeNode<DocIndex>[]; title: string }): JSX.Element => {
  const [folded, setFolded] = useState(false)
  return (
    <div className="flex flex-col min-h-0 overflow-hidden">
      <div className="flex flex-col min-h-0 overflow-hidden">
        <div
          className={`group flex justify-between items-center px-2 text-sm text-gray-700 
          tracking-wide leading-7 cursor-pointer select-none  hover:bg-gray-200/70 
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
              <span className="leading-snug px-2 rounded-full text-xs bg-gray-200 text-gray-700 font-medium mix-blend-multiply">
                {docIndicies.length}
              </span>
            </span>
          </div>
        </div>
      </div>

      {docIndicies?.length > 0
        ? !folded && docIndicies.map((e, i) => <DocIndexComponent key={i} node={e} />)
        : !folded && (
            <span className="px-4 inline-block text-sm text-gray-400 text-center italic text-shadow">尚無筆記</span>
          )}
    </div>
  )
}
export default DocIndexSection
