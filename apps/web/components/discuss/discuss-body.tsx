import moment from 'moment'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useDiscussPostsQuery } from '../../apollo/query.graphql'
import DiscussPostEmojis from './discuss-post-emojis'

const dummyData = [
  '測試測試大家好',
  '大家一起吃飯吧 哈哈哈 大家一起吃飯吧 哈哈哈 大家一起吃飯吧 哈哈哈 大家一起吃飯吧 哈哈哈 大家一起吃飯吧 哈哈哈',
  '好尷尬唷嗚嗚嗚',
  '好尷尬唷嗚嗚嗚',
  '好尷尬唷嗚嗚嗚',
]

const DiscussBody = ({ discussId }: { discussId: string }) => {
  const { data, loading } = useDiscussPostsQuery({ variables: { discussId } })

  if (loading) {
    return null
  }
  return (
    <div className="flex-shrink min-w-0">
      <h3 className=" my-2 font-medium">共{data?.discussPosts.length}則留言</h3>
      {data?.discussPosts.map((post, i) => {
        return (
          <div
            id={`discuss-post-${post.id}`}
            key={i}
            className="flex py-2 border-t last:border-b border-gray-100 text-sm "
          >
            <span className="material-icons mr-2 text-xl sm:text-3xl leading-none text-gray-300">account_circle</span>
            <div className="flex-grow">
              <div className=" flex items-center justify-between ">
                <div className="flex-shrink min-w-0 inline-flex flex-col truncate">
                  <span className="inline-block min-w-0  text-gray-800 font-medium truncate">{post.userId}</span>
                  <span className="inline-block   text-gray-400 text-xs">
                    {moment(post.createdAt).subtract(10, 'days').calendar()}
                  </span>
                </div>
                <span className=" inline-block right-0">
                  <DiscussPostEmojis discussPostId={post.id} />
                </span>
              </div>
              <div className=" pr-2 py-2 whitespace-pre-wrap [word-break:break-word] text-gray-800">{post.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DiscussBody
