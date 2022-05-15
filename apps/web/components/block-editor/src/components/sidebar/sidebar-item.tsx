import React from 'react'
import Link from 'next/link'
import { NoteDraftEntryFragment } from '../../../../../apollo/query.graphql'
import { useObservable } from '@ngneat/react-rxjs'
import { editorRepo } from '../../stores/editor.repository'
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
  const [route] = useObservable(editorRepo.route$, { initialValue: null }),
    { symbol, title } = item

  if (route === null) {
    return null
  }
  return (
    <div className="overflow-hidden hover:overflow-y-auto text-sm text-gray-500 mix-blend-multiply">
      <Link
        href={{
          pathname: '/note/[symbol]',
          query: { symbol },
        }}
      >
        <a
          className={`group flex items-center gap-1 pl-4 pr-4 leading-relax ${
            route.symbolMain == symbol
              ? 'bg-gray-200/70 hover:bg-gray-300/70'
              : 'bg-transparent hover:bg-gray-200/70'
          } `}
        >
          <span className="material-icons text-lg text-[20px] text-gray-300 mix-blend-multiply">
            {symbol.startsWith('@') ? 'language' : 'notes'}
          </span>
          <span className="inline-block min-w-0 flex-1 truncate mix-blend-multiply">
            <ItemLabel symbol={symbol} title={title ?? undefined} />
          </span>

          {/* <SidebarItemPanel node={node} /> */}
        </a>
      </Link>

      {/* {children.length > 0 && (
        <ul className="p-0">
          {children.map((e, idx) => {
            if (e.data === undefined) {
              throw 'e.data === undefined'
            }
            return (
              <Link
                key={idx}
                href={{
                  pathname: '/note/[symbol]',
                  query: { symbol: e.data.symbol },
                }}
              >
                <a
                  className={`group flex items-center gap-1 pl-14 pr-4  ${
                    router.query.symbol == e.data.symbol
                      ? 'bg-gray-200/70 hover:bg-gray-300/70'
                      : 'bg-transparent hover:bg-gray-200/70'
                  } `}
                >
                  <span
                    className={`material-icons text-lg text-gray-300 mix-blend-multiply`}
                  >
                    insert_drive_file
                  </span>

                  <span className="inline-block min-w-0 flex-1 truncate mix-blend-multiply">
                    {changeTitle(e.data)}
                  </span>

                  <DocIndexPanel node={e} />
                </a>
              </Link>
            )
          })}
        </ul>
      )} */}
    </div>
  )
}

export default SidebarItem
