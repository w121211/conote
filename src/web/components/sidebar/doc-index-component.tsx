import Link from 'next/link'
import React from 'react'
import { TreeNode, TreeService } from '../../../packages/docdiff/src'
import { DocIndex } from '../workspace/doc-index'
import DocIndexPanel from './doc-index-panel'
// import { DocEntryPack } from '../workspace/doc'
// import ContentPanel from './doc-index-panel'

// const DocIndexComponent = ({ node }: { node: TreeNode<DocIndex> }) => {
//   const client = useApolloClient()
//   if (node.data === undefined) {
//     throw 'node.data === undefined'
//   }
//   return (
//     <>
//       <Link href={{ pathname: '/card/[symbol]', query: { symbol: node.data.symbol } }}>
//         <a>{node.data.title ?? node.data.symbol}</a>
//       </Link>
//       {TreeService.isRoot(node) && (
//         <button
//           onClick={async () => {
//             await workspace.commit(node, client) // commit node-doc and all of its child-docs
//           }}
//         >
//           (Commit)
//         </button>
//       )}
//       <button
//         onClick={async () => {
//           if (node.children.length > 0) {
//             console.warn('will remove all sub docs')
//           } else {
//             await Doc.removeDoc(node.cid)
//             await workspace.updateEditingDocIndicies()
//           }
//         }}
//       >
//         (X)
//       </button>
//       {node.children.length > 0 && (
//         <p>
//           {node.children.map((e, i) => (
//             <span key={i}>
//               - <DocIndexComponent node={e} />
//             </span>
//           ))}
//         </p>
//       )}
//     </>
//   )
// }

/**
 * TODO: not recursive, only allow one-level children
 */
const DocIndexComponent = ({ node }: { node: TreeNode<DocIndex> }): JSX.Element => {
  if (node.data === undefined) {
    throw 'node.data === undefined'
  }
  const children = TreeService.toList(node.children)

  return (
    <div className="overflow-hidden hover:overflow-y-auto text-sm text-gray-600">
      <span className="group flex items-center gap-1 pl-8 pr-4 leading-relax hover:bg-gray-200/70 cursor-pointer ">
        <span className="material-icons-outlined text-lg text-[20px] text-gray-400/50">
          {node.data.symbol.startsWith('@') ? 'web' : 'article'}
        </span>
        <Link href={{ pathname: '/card/[symbol]', query: { symbol: node.data.symbol } }}>
          <a className="inline-block min-w-0 flex-1 truncate">
            {node.data.symbol.startsWith('$') ? node.data.symbol : node.data.title ?? node.data.symbol}
          </a>
        </Link>
        <DocIndexPanel node={node} />
      </span>

      {children.length > 0 && (
        <ul className="p-0">
          {children.map((e, idx) => {
            if (e.data === undefined) {
              throw 'e.data === undefined'
            }
            return (
              <li key={idx} className="group flex items-center gap-1 pl-14 pr-4  cursor-pointer hover:bg-gray-200/70">
                <span className={`material-icons text-lg text-gray-400/50 mix-blend-multiply`}>subject</span>

                <Link href={{ pathname: '/card/[symbol]', query: { symbol: e.data.symbol } }}>
                  <a className="inline-block min-w-0 flex-1 truncate">
                    {e.data.symbol.startsWith('$') ? e.data.symbol : e.data.title ?? e.data.symbol}
                  </a>
                </Link>

                {/* <span className="truncate">{e.data?.symbol}</span> */}
                <DocIndexPanel node={e} />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
export default DocIndexComponent