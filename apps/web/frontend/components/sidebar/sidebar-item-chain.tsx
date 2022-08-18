import { useObservable } from '@ngneat/react-rxjs'
import Link from 'next/link'
import React from 'react'
import { UrlObject } from 'url'
import {
  CommitFragment,
  NoteDraftEntryFragment,
} from '../../../apollo/query.graphql'
import { getDraftPageURL } from '../../utils'
import { editorRepo } from '../editor-textarea/src/stores/editor.repository'
import SidebarItemPanel from './sidebar-item-panel'

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

const SidebarItem = ({
  item,
  href,
}: {
  item: NoteDraftEntryFragment
  href: UrlObject
}): JSX.Element | null => {
  const [tab] = useObservable(editorRepo.tab$),
    { symbol, title, id } = item

  // if (item.status === 'DROP') {
  //   return (
  //     <div className="overflow-hidden hover:overflow-y-auto text-sm text-gray-500 ">
  //       <span
  //         className={`group flex items-center gap-1 pl-4 pr-4 leading-relax ${
  //           opening.main.symbol == symbol
  //             ? 'bg-gray-200 hover:bg-gray-300/80'
  //             : 'bg-transparent hover:bg-gray-200'
  //         } `}
  //       >
  //         <span className="material-icons text-lg text-[20px] text-gray-400/60">
  //           {symbol.startsWith('@') ? 'language' : 'notes'}
  //         </span>
  //         <span className="inline-block min-w-0 flex-1 truncate ">
  //           <ItemLabel symbol={symbol} title={title ?? undefined} />
  //         </span>
  //         <SidebarItemPanel item={item} />
  //       </span>
  //     </div>
  //   )
  // }
  return (
    <div className="overflow-hidden hover:overflow-y-auto text-sm text-gray-500 ">
      <Link href={href}>
        <a
          className={`group flex items-center gap-1 pl-8 pr-4 leading-relax ${
            tab.openingDraftId === id
              ? 'bg-gray-200 hover:bg-gray-300/80'
              : 'bg-transparent hover:bg-gray-200'
          }`}
        >
          <span className="material-icons-outlined text-lg text-[20px] text-gray-400/60">
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

type Props = {
  itemFirst: NoteDraftEntryFragment
  itemsRest: NoteDraftEntryFragment[]
  onCommitCompleted?: (data: CommitFragment) => void
}

/**
 *
 */
const SidebarItemChain = ({
  itemFirst,
  itemsRest,
  onCommitCompleted,
}: Props): JSX.Element | null => {
  const [tab] = useObservable(editorRepo.tab$),
    { symbol, title, id } = itemFirst

  return (
    <div className="text-sm text-gray-500 ">
      <Link href={getDraftPageURL(itemFirst.id, itemFirst.id)}>
        <a
          className={`group flex items-center gap-1 pl-4 pr-4 leading-relax ${
            tab.openingDraftId == id
              ? 'bg-gray-200 hover:bg-gray-300/80'
              : 'bg-transparent hover:bg-gray-200'
          } `}
        >
          <span className="material-icons-outlined text-lg text-[20px] text-gray-400/60">
            {symbol.startsWith('@') ? 'language' : 'notes'}
          </span>

          <span className="inline-block min-w-0 flex-1 truncate ">
            <ItemLabel symbol={symbol} title={title ?? undefined} />
          </span>

          <SidebarItemPanel
            item={itemFirst}
            onCommitCompleted={onCommitCompleted}
          />
        </a>
      </Link>

      <ol>
        {itemsRest.map(e => (
          <li key={e.id}>
            <span>
              <SidebarItem
                item={e}
                href={getDraftPageURL(e.id, itemFirst.id)}
              />
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default SidebarItemChain
