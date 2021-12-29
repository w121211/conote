import React, { useState } from 'react'
import { TreeNode } from '../../../packages/docdiff/src'
import { DocIndex } from '../workspace/doc-index'
import DocIndexPanel from './doc-index-panel'
import DocIndexComponent from './docIndexComponent'

const DocIndexHeader = ({
  title,
  indexLength,
  showMore,
  onClickShowMore,
}: {
  title?: string
  indexLength: number
  showMore: boolean
  onClickShowMore: () => void
}): JSX.Element => {
  return (
    <div className="flex flex-col min-h-0 overflow-hidden">
      {title && (
        <div
          className={`group flex justify-between items-center px-2 text-sm text-gray-700 font-bold 
          tracking-wide leading-7 cursor-pointer select-none  hover:bg-gray-200 
          `}
          onClick={onClickShowMore}
        >
          <div className="flex items-center">
            {showMore ? (
              <span className="material-icons">expand_more</span>
            ) : (
              <span className="material-icons">chevron_right</span>
            )}
            <span className="flex items-center gap-1">
              {title}
              <span className="text-gray-500 font-normal">{indexLength}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
export default DocIndexHeader
