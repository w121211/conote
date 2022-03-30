import moment from 'moment'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import { DiscussPostFragment } from '../apollo/query.graphql'
import DiscussPostEmojis from '../components/discuss/post/post-emojis'
import PostOptionsMenu from '../components/discuss/post/post-options-menu'
import { Tile } from './tile'

export const PostTile = ({ post, userId }: { post: DiscussPostFragment; userId: string }) => {
  return (
    <Tile className="pb-1">
      <div className="flex gap-2">
        <div>
          <span className="text-lg font-medium text-gray-400 leading-none">#{post.id}</span>
          <div className="flex items-center ">
            {/* <span className="material-icons-outlined text-gray-300 leading-none">tag</span> */}
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex-shrink min-w-0 flex items-center gap-2 truncate">
            <Link href={{ pathname: '/user/[userId]', query: { userId: post.userId } }}>
              <a className="inline-block min-w-0 text-sm text-blue-400 font-medium truncate underline-offset-2 hover:underline">
                {post.userId}
              </a>
            </Link>
            {/* <span className="inline-block min-w-0 text-sm text-blue-400 font-medium truncate"></span> */}
            <span className="inline-block text-gray-400 text-xs">
              {moment(post.createdAt).subtract(10, 'days').calendar()}
            </span>
          </div>
          <p className=" pr-2 py-2 whitespace-pre-wrap [word-break:break-word] text-gray-700 text-sm">
            {post.content.trim()}
          </p>

          {/* <div className="flex pt-1 border-t border-gray-200">{bottomBtn}</div> */}
          <div className="flex pt-1 border-t border-gray-200">
            <div className="flex-grow">
              <DiscussPostEmojis discussPostId={post.id} disable={userId === post.userId} />
            </div>
            <button className="btn-reset-style p-1 rounded text-gray-500 text-sm leading-none hover:bg-gray-100 hover:text-gray-700">
              <span className="material-icons-outlined text-base leading-none">reply</span>回覆
            </button>
            <PostOptionsMenu isMyPost={userId === post.userId ?? false} />
          </div>
        </div>
      </div>
    </Tile>
  )
}
