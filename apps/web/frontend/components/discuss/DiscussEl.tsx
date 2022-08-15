import moment from 'moment'
import Link from 'next/link'
import React, { useState } from 'react'
import { DiscussFragment } from '../../../apollo/query.graphql'
import { getNotePageURL } from '../../utils'
import { useMeContext } from '../auth/use-me-context'
import SymbolDecorate from '../symbol/SymbolDecorate'
import { Box } from '../ui/box'
import DiscussEmojis from './DiscussEmojis'
import DiscussUpdateForm from './DiscussUpdateForm'
import OptionsMenu from './OptionsMenu'

const Content = ({
  data: { id, userId, title, content, createdAt, noteEntries },
  isMeOwner,
}: Props & { isMeOwner: boolean }) => (
  <>
    <h3 className="my-2 text-gray-800 font-medium">
      <span className="text-gray-300 mr-1">#</span>
      {title}
      <span className="text-gray-300 ml-1">#</span>
    </h3>

    {/* <div className="mb-2 flex flex-shrink min-w-0 gap-2 items-center truncate text-xs">
      <Link
        href={{
          pathname: '/user/[userId]',
          query: { userId },
        }}
      >
        <a className="link">
          @{userId.slice(-6)}
          {isMeOwner ? ' / Me' : null}
        </a>
      </Link>
      <span className="text-gray-400">{moment(createdAt).format('ll')}</span>
    </div> */}

    <div className="flex-grow">
      <div className="flex-shrink min-w-0 flex items-center gap-2 truncate">
        <Link
          href={{
            pathname: '/user/[userId]',
            query: { userId },
          }}
        >
          <a className="link inline-block min-w-0 text-sm font-medium truncate ">
            @{userId.slice(-6)}
            {isMeOwner ? ' / Me' : null}
          </a>
        </Link>
        {/* <span className="inline-block min-w-0 text-sm text-blue-400 font-medium truncate"></span> */}
        <span className="inline-block text-gray-400 text-xs">
          {moment(createdAt).format('ll')}
        </span>
      </div>
    </div>

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

    {content ? (
      <p className="pr-2 py-2 whitespace-pre-wrap [word-break:break-word] text-sm text-gray-700">
        {content}
      </p>
    ) : (
      <p className="pr-2 py-2 whitespace-pre-wrap [word-break:break-word] text-sm text-gray-400 italic">
        Empty description
      </p>
    )}
  </>
)

interface Props {
  data: DiscussFragment
}

const DiscussEl = ({ data }: Props): JSX.Element => {
  const { me } = useMeContext()
  const { id, userId, title, content, createdAt, noteEntries } = data
  const isMeOwner = me?.id === userId
  const [showForm, setShowForm] = useState(false)

  function onClickDelete() {
    // if (isMeOwner) {}
  }
  function onClickEdit() {
    if (isMeOwner) setShowForm(true)
  }
  function onClickReport() {
    // if (!isMeOwner) setShowForm(true)
  }

  return (
    <Box padding="md">
      <div className="flex gap-1">
        {noteEntries?.map(({ sym: { symbol } }, i) => {
          return (
            <Link key={i} href={getNotePageURL(symbol)}>
              <a className={`symbol-link last:mr-0 tracking-wide text-sm`}>
                <SymbolDecorate symbolStr={symbol} />
              </a>
            </Link>
          )
        })}
      </div>

      {showForm ? (
        <DiscussUpdateForm
          discuss={data}
          onClickCancel={() => setShowForm(false)}
          onSubmitCompleted={() => setShowForm(false)}
        />
      ) : (
        <Content data={data} isMeOwner={isMeOwner} />
      )}

      <div className="flex mt-2 pt-1 border-t border-gray-200">
        <div className="flex-grow">
          <DiscussEmojis discussId={id} disabled={me === null || isMeOwner} />
        </div>

        {/* <button className="flex p-1 rounded text-gray-500 text-sm leading-none hover:bg-gray-100 hover:text-gray-700">
          <span className="material-icons-outlined text-base leading-none">
            reply
          </span>
          Reply
        </button> */}

        {isMeOwner && (
          <OptionsMenu
            {...{ isMeOwner, onClickDelete, onClickEdit, onClickReport }}
          />
        )}
      </div>
    </Box>
  )
}

export default DiscussEl
