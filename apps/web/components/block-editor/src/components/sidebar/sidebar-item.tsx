import React from 'react'
import Link from 'next/link'
import { NoteDraftEntryFragment } from '../../../../../apollo/query.graphql'
import { useObservable } from '@ngneat/react-rxjs'
import { editorRepo } from '../../stores/editor.repository'
import SidebarItemPanel from './sidebar-item-panel'
import { getNotePageURL } from '../../../../utils'
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

const ItemLabel = ({
  symbol,
  title,
}: {
  symbol: string
  title?: string
}): JSX.Element => {
  if (symbol.startsWith('$')) {
    return (
      <>
        {symbol}
        <span className="ml-2 text-gray-500/70 font-light text-xs">
          {title}
        </span>
      </>
    )
  }
  if (symbol.startsWith('http')) {
    const url = new URL(symbol).hostname.replace('www.', '')
    return (
      <>
        <span className="flex-shrink-0 inline-flex max-w-[135px] ">
          <span className="truncate ">{title ?? symbol}</span>
        </span>
        <span className="ml-2 text-gray-500/70 font-light text-xs">{url}</span>
      </>
    )
  }
  if (symbol.startsWith('[[')) {
    return (
      <>
        <span className="text-gray-400/70">[[</span>
        {symbol.substring(2, symbol.length - 2)}

        <span className="text-gray-400/70">]]</span>
      </>
    )
  }
  return <>{symbol}</>
}

/**
 *
 */
const SidebarItem = ({
  item,
}: {
  item: NoteDraftEntryFragment
}): JSX.Element | null => {
  const [opening] = useObservable(editorRepo.opening$, { initialValue: null }),
    { symbol, title } = item

  if (opening === null) {
    return null
  }
  if (item.status === 'DROP') {
    return (
      <div className="overflow-hidden hover:overflow-y-auto text-sm text-gray-500 ">
        <span
          className={`group flex items-center gap-1 pl-4 pr-4 leading-relax ${
            opening.main.symbol == symbol
              ? 'bg-gray-200 hover:bg-gray-300/80'
              : 'bg-transparent hover:bg-gray-200'
          } `}
        >
          <span className="material-icons text-lg text-[20px] text-gray-400/60">
            {symbol.startsWith('@') ? 'language' : 'notes'}
          </span>
          <span className="inline-block min-w-0 flex-1 truncate ">
            <ItemLabel symbol={symbol} title={title ?? undefined} />
          </span>
          <SidebarItemPanel item={item} />
        </span>
      </div>
    )
  }
  return (
    <div className="overflow-hidden hover:overflow-y-auto text-sm text-gray-500 ">
      <Link href={getNotePageURL('edit', item.symbol)}>
        <a
          className={`group flex items-center gap-1 pl-4 pr-4 leading-relax ${
            opening.main.symbol == symbol
              ? 'bg-gray-200 hover:bg-gray-300/80'
              : 'bg-transparent hover:bg-gray-200'
          } `}
        >
          <span className="material-icons text-lg text-[20px] text-gray-400/60">
            {symbol.startsWith('@') ? 'language' : 'notes'}
          </span>
          <span className="inline-block min-w-0 flex-1 truncate ">
            <ItemLabel symbol={symbol} title={title ?? undefined} />
          </span>
          <SidebarItemPanel item={item} />
        </a>
      </Link>
    </div>
  )
}

export default SidebarItem
