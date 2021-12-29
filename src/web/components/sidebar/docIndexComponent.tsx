import Link from 'next/link'
import React from 'react'
import { TreeNode } from '../../../packages/docdiff/src'
import { DocIndex } from '../workspace/doc-index'
import DocIndexPanel from './doc-index-panel'
// import { DocEntryPack } from '../workspace/doc'
import ContentPanel from './doc-index-panel'

const DocIndexComponent = ({ indexArray }: { indexArray: TreeNode<DocIndex>[] }): JSX.Element => {
  return (
    <div className="overflow-hidden hover:overflow-y-auto">
      {indexArray.map((e, i) => {
        if (!e.data) {
          return null
        }
        return (
          <div key={i} className="text-sm">
            <div className="text-gray-700">
              <span className="group flex items-center gap-1 pl-8 pr-4 leading-relax hover:bg-gray-200 cursor-pointer ">
                <span className="material-icons-outlined text-lg text-gray-400">article</span>
                <Link href={`/card/${encodeURIComponent(e.data.symbol)}`}>
                  <a className="inline-block min-w-0 flex-1 truncate">{e.data.title || e.data.symbol}</a>
                </Link>
                <DocIndexPanel node={e} />
              </span>

              {e.children.length > 0 && (
                <ul className="p-0">
                  {e.children.map((el, idx) => {
                    return (
                      <div key={idx} className="pl-10 pr-4 hover:bg-gray-200 cursor-pointer ">
                        <li className="flex items-center pl-2 border-l border-gray-300 mix-blend-multiply">
                          <span className={`material-icons text-lg text-gray-400`}>notes</span>
                          <span className="truncate">{el.data?.symbol}</span>
                          <DocIndexPanel node={el} />
                        </li>
                      </div>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
export default DocIndexComponent
