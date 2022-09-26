import React from 'react'
import Link from 'next/link'
import moment from 'moment'
import { DiscussFragment } from '../../../apollo/query.graphql'
import { getNotePageURL } from '../../utils'
import SymbolDecorate from '../symbol/SymbolDecorate'

const DiscussListItem = ({
  discuss: { id, updatedAt, title, noteEntries },
}: {
  discuss: DiscussFragment
}) => (
  <>
    <div className="flex-1 min-w-0">
      <p className="pb-2 text-xs text-gray-500 dark:text-gray-400">
        {noteEntries.map(({ id, sym }, i) => (
          <span key={id}>
            <Link href={getNotePageURL(sym.symbol)}>
              <a className="hover:underline">
                <SymbolDecorate
                  key={id}
                  symbol={sym.symbol}
                  title={null}
                  gray
                />
              </a>
            </Link>
            {i < noteEntries.length - 1 ? '· ' : ''}
          </span>
        ))}
      </p>

      <Link
        href={{
          pathname: '/discuss/[discussid]',
          query: { discussid: id },
        }}
      >
        <a className="text-blue-600 dark:text-white hover:underline">
          <span className="text-gray-300">#</span>
          {title}
          <span className="text-gray-300">#</span>
        </a>
      </Link>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400 align-right">
      {moment(updatedAt).fromNow()}
    </p>
  </>
)

interface Props {
  discusses: DiscussFragment[]
}

const DiscussList = ({ discusses }: Props) => {
  return (
    <div>
      {discusses.length > 0 ? (
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          {discusses.map(e => (
            <li key={e.id} className="py-2 sm:py-3">
              <div className="flex items-center space-x-4">
                {<DiscussListItem discuss={e} />}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic h-36">Empty :{'('}</p>
      )}
    </div>
  )
}

export default DiscussList
