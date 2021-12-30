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
          className={`group flex justify-between items-center px-2 text-sm text-gray-700 font-bold 
          tracking-wide leading-7 cursor-pointer select-none  hover:bg-gray-200 
          `}
          onClick={() => {
            setFolded(!folded)
          }}
        >
          <div className="flex items-center">
            {folded ? (
              <span className="material-icons">expand_more</span>
            ) : (
              <span className="material-icons">chevron_right</span>
            )}
            <span className="flex items-center gap-1">
              {title}
              <span className="text-gray-500 font-normal">{docIndicies.length}</span>
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
