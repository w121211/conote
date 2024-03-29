import moment from 'moment'
import React from 'react'
import Link from 'next/link'
import { DiscussPostFragment } from '../../../apollo/query.graphql'
import OptionsMenu from '../discuss/options-menu'
import DiscussPostEmojis from './discuss-post-emojis'
import { Box } from '../ui-component/box'
import { useMeContext } from '../auth/use-me-context'

const DiscussPostTile = ({ post }: { post: DiscussPostFragment }) => {
  const { me } = useMeContext()

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
                @{post.userId.slice(-6)}
                {me?.id === post.userId ? '(you)' : null}
              </a>
            </Link>
            {/* <span className="inline-block min-w-0 text-sm text-blue-400 font-medium truncate"></span> */}
            <span className="inline-block text-gray-400 text-xs">
              {moment(post.createdAt).subtract(10, 'days').format('ll')}
            </span>
          </div>
          <p className=" pr-2 py-2 whitespace-pre-wrap [word-break:break-word] text-gray-700 text-sm">
            {post.content.trim()}
          </p>

          <div className="flex items-center pt-1 border-t border-gray-200">
            <div className="flex-grow">
              <DiscussPostEmojis
                discussPostId={post.id}
                disable={me?.id === post.userId || !me}
              />
            </div>
            {/* <button className="flex items-center p-1 rounded text-gray-500 text-sm leading-none hover:bg-gray-100 hover:text-gray-700">
              <span className="material-icons-outlined text-base leading-none">
                reply
              </span>
              Reply
            </button>
            <OptionsMenu isMyPost={me?.id === post.userId} /> */}
          </div>
        </div>
      </div>
    </Box>
  )
}

export default DiscussPostTile
