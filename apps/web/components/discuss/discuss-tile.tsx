import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { DiscussFragment } from '../../apollo/query.graphql'
import { getNotePageURL } from '../page-utils'
import { useMeContext } from '../auth/use-me-context'
import { Box } from '../ui-component/box'
import { styleSymbol } from '../ui-component/style-fc/style-symbol'
import DiscussEmojis from './discuss-emojis'
import OptionsMenu from './options-menu'

const hashtags = ['時間旅行', 'Vtuber']

const currentTab = ''

const quote = '這則討論和其他重複了!'

interface Props {
  data: DiscussFragment
}

const DiscussTile = ({ data }: Props): JSX.Element => {
  const { me } = useMeContext()
  const { id, userId, title, content, createdAt, noteEntries } = data
  return (
    <Box padding="md">
      <div className="flex gap-1">
        {noteEntries?.map(({ sym: { symbol } }, i) => {
          return (
            <Link key={i} href={getNotePageURL('base', symbol)}>
              <a className={`symbol-link last:mr-0 text-sm tracking-wide `}>
                {styleSymbol(symbol)}
              </a>
            </Link>
          )
        })}
      </div>
      <h2 className="mt-2 mb-1 text-gray-800 text-xl font-medium">
        <span className="text-gray-300">#</span>
        {title}
        <span className="text-gray-300">#</span>
      </h2>
      <div className=" mb-2 flex-shrink min-w-0 flex items-center gap-2 truncate">
        <Link
          href={{
            pathname: '/user/[userId]',
            query: { userId: userId },
          }}
        >
          <a className="link inline-block min-w-0 text-sm font-medium truncate ">
            {userId}
          </a>
        </Link>
        {/* <span className="inline-block min-w-0 text-sm text-blue-400 font-medium truncate"></span> */}
        <span className="inline-block text-gray-400 text-xs">
          {moment(createdAt).subtract(10, 'days').format('ll')}
        </span>
      </div>

      {content && (
        <p className=" pr-2 py-2 whitespace-pre-wrap [word-break:break-word] text-gray-700 text-sm">
          {content.trim()}
        </p>
      )}

      {/* {quote && (
        <div className="mt-2 mb-4 px-4 py-2 bg-gray-100 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="material-icons-round text-lg leading-none">
              warning
            </span>
            <p>{quote}</p>
          </div>
          <p className="text-right text-gray-400">{moment().calendar()}</p>
        </div>
      )} */}

      <div className="flex mt-2 pt-1 border-t border-gray-200">
        <div className="flex-grow">
          <DiscussEmojis discussId={id} disable={me?.id === userId || !me} />
        </div>
        {/* <button className="flex p-1 rounded text-gray-500 text-sm leading-none hover:bg-gray-100 hover:text-gray-700">
          <span className="material-icons-outlined text-base leading-none">
            reply
          </span>
          Reply
        </button>
        <OptionsMenu isMyPost={me?.id === data.userId ?? false} /> */}
      </div>
    </Box>
  )
}

export default DiscussTile
