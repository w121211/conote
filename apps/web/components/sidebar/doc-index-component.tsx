import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { TreeNode, TreeService } from '@conote/docdiff'
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
function changeTitle({ symbol, title }: DocIndex) {
  if (symbol.startsWith('$')) {
    return (
      <>
        {symbol}
        <span className="ml-2 text-gray-500/70 font-light text-xs">{title}</span>
      </>
    )
  }
  if (symbol.startsWith('@')) {
    const newSym = symbol.substring(1)
    const url = new URL(newSym).hostname.replace('www.', '')
    return (
      <>
        <span className="flex-shrink-0 inline-flex max-w-[135px] ">
          <span className="truncate ">{title ?? symbol}</span>
        </span>
        <span className="ml-2 text-gray-500/70 font-light text-xs">{url}</span>
      </>
    )
  }
  return symbol
}

/**
 * TODO: not recursive, only allow one-level children
 */
const DocIndexComponent = ({ node }: { node: TreeNode<DocIndex> }): JSX.Element => {
  if (node.data === undefined) {
    throw 'node.data === undefined'
  }
  const children = TreeService.toList(node.children)
  const router = useRouter()
  return (
    <div className="overflow-hidden hover:overflow-y-auto text-sm text-gray-500 mix-blend-multiply">
      <span
        className={`group flex items-center gap-1 pl-8 pr-4 leading-relax ${
          router.query.symbol == node.data.symbol
            ? 'bg-gray-200/70 hover:bg-gray-300/70'
            : 'bg-transparent hover:bg-gray-200/70'
        }  cursor-pointer`}
      >
        <span className="material-icons text-lg text-[20px] text-gray-300 mix-blend-multiply">
          {node.data.symbol.startsWith('@') ? 'language' : 'insert_drive_file'}
        </span>
        <Link href={{ pathname: '/card/[symbol]', query: { symbol: node.data.symbol } }}>
          <a className="inline-block min-w-0 flex-1 truncate mix-blend-multiply">{changeTitle(node.data)}</a>
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
              <li
                key={idx}
                className={`group flex items-center gap-1 pl-14 pr-4 cursor-pointer ${
                  router.query.symbol == e.data.symbol
                    ? 'bg-gray-200/70 hover:bg-gray-300/70'
                    : 'bg-transparent hover:bg-gray-200/70'
                } `}
              >
                <span className={`material-icons text-lg text-gray-300 mix-blend-multiply`}>insert_drive_file</span>

                <Link href={{ pathname: '/card/[symbol]', query: { symbol: e.data.symbol } }}>
                  <a className="inline-block min-w-0 flex-1 truncate mix-blend-multiply">{changeTitle(e.data)}</a>
                </Link>

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
