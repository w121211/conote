import React from 'react'
import Link from 'next/link'
import moment from 'moment'
import { DiscussFragment } from '../../../apollo/query.graphql'
import { getNotePageURL } from '../../utils'
import CardList from '../ui/CardList'
import SymbolDecorate from '../symbol/SymbolDecorate'

interface Props {
  discusses: DiscussFragment[]
}

const DiscussList = ({ discusses }: Props) => {
  return (
    <CardList
      header={<h1 className="leading-none">Latest Discussions</h1>}
      items={discusses}
      renderItem={({ id, updatedAt, title, noteEntries }) => (
        <>
          <div className="flex-1 min-w-0">
            <p className="pb-2 text-xs text-gray-500 dark:text-gray-400">
              {noteEntries.map(({ id, sym }, i) => (
                <span key={id}>
                  <Link href={getNotePageURL(sym.symbol)}>
                    <a className="hover:underline">
                      <SymbolDecorate key={id} symbolStr={sym.symbol} gray />
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
      )}
    />
  )
}

export default DiscussList
