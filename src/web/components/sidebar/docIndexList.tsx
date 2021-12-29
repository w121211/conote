import React, { useState } from 'react'
import { TreeNode } from '../../../packages/docdiff/src'
import { DocIndex } from '../workspace/doc-index'
import DocIndexComponent from './docIndexComponent'
import DocIndexHeader from './docIndexHeader'

const DocIndexList = ({
  title,
  indexArray,
}: {
  title?: string
  indexArray: TreeNode<DocIndex>[] | null
}): JSX.Element => {
  const [showMore, setShowMore] = useState(true)
  return (
    <div className="flex flex-col min-h-0 overflow-hidden">
      {title && (
        <DocIndexHeader
          title={title}
          indexLength={indexArray?.length ?? 0}
          showMore={showMore}
          onClickShowMore={() => setShowMore(!showMore)}
        />
      )}
      {title && indexArray && indexArray?.length > 0
        ? showMore && <DocIndexComponent indexArray={indexArray} />
        : showMore && (
            <span className="px-4 inline-block text-sm text-gray-400 text-center italic text-shadow">尚無筆記</span>
          )}
    </div>
  )
}
export default DocIndexList
