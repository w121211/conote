import moment from 'moment'
import React, { useState } from 'react'
import Link from 'next/link'
import { DiscussPostFragment } from '../../../apollo/query.graphql'
import OptionsMenu from '../discuss/OptionsMenu'
import DiscussPostEmojis from './DiscussPostEmojis'
import { Box } from '../ui/box'
import { useMeContext } from '../auth/use-me-context'
import DiscussPostUpdateForm from './DiscussPostUpdateForm'
import { shortenUserId } from '../../utils'

type Props = {
  // discussId: string
  post: DiscussPostFragment
}

const DiscussPostTile = (props: Props) => {
  const { post } = props
  const { me } = useMeContext()
  const [showForm, setShowForm] = useState(false)
  const isMeOwner = me?.id === post.userId

  // function onClickDelete() {
  // if (isMeOwner) {}
  // }
  function onClickEdit() {
    if (isMeOwner) setShowForm(true)
  }
  // function onClickReport() {
  //   if (!isMeOwner) setShowForm(true)
  // }

  function onSubmitCompleted() {
    setShowForm(false)
  }
  function onClickCancel() {
    setShowForm(false)
  }

  return (
    <Box padding="sm">
      <div className="flex gap-2">
        <div>
          <span className="text-lg font-medium text-gray-400 leading-none">
            {/* #{parseInt(post.id) + 1} */}#
          </span>
          <div className="flex items-center ">
            {/* <span className="material-icons-outlined text-gray-300 leading-none">tag</span> */}
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex-shrink min-w-0 flex items-center gap-2 truncate">
            <Link
              href={{
                pathname: '/user/[userId]',
                query: { userId: post.userId },
              }}
            >
              <a className="link inline-block min-w-0 text-sm font-medium truncate ">
                {shortenUserId(post.userId, me)}
              </a>
            </Link>
            {/* <span className="inline-block min-w-0 text-sm text-blue-400 font-medium truncate"></span> */}
            <span className="inline-block text-gray-400 text-xs">
              {moment(post.createdAt).format('ll')}
            </span>
          </div>

          {showForm ? (
            <DiscussPostUpdateForm
              {...{ ...props, onSubmitCompleted, onClickCancel }}
            />
          ) : (
            <p className="pr-2 py-2 whitespace-pre-wrap [word-break:break-word] text-gray-700 text-sm">
              {post.content}
            </p>
          )}

          <div className="flex items-center pt-1 border-t border-gray-200">
            <div className="flex-grow">
              <DiscussPostEmojis
                discussPostId={post.id}
                disabled={me === null || isMeOwner}
              />
            </div>
            {/* <button className="flex items-center p-1 rounded text-gray-500 text-sm leading-none hover:bg-gray-100 hover:text-gray-700">
              <span className="material-icons-outlined text-base leading-none">
                reply
              </span>
              Reply
            </button> */}
            {isMeOwner && <OptionsMenu {...{ isMeOwner, onClickEdit }} />}
          </div>
        </div>
      </div>
    </Box>
  )
}

export default DiscussPostTile
