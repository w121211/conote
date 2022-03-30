import moment from 'moment'
import React from 'react'
import { DiscussFragment, useMeQuery } from '../apollo/query.graphql'
import DiscussEmojis from '../components/discuss/discuss-emojis'
import PostOptionsMenu from '../components/discuss/post/post-options-menu'
import { Tile } from './tile'

const hashtags = ['時間旅行', 'Vtuber']

const currentTab = ''

const quote = '這則討論和其他重複了!'

const date = new Date()

export const DiscussTile = ({ data }: { data: DiscussFragment }) => {
  const { data: meData } = useMeQuery()
  return (
    <Tile className="mb-3 pl-10 pt-4 pb-1">
      <div className="flex gap-1">
        {hashtags.map((tag, i) => {
          return (
            <span
              className={` px-1 last:mr-0 rounded text-xs text-gray-800 bg-gray-200 tracking-wide ${
                currentTab === tag ? 'text-blue-500' : ''
              }`}
              key={i}
            >
              {/* {i > 0 && <span className="inline-block mx-1 font-[Arial]">·</span>} */}
              {tag}
            </span>
          )
        })}
      </div>
      <h2 className="mt-2 tracking-wider text-gray-600 text-xl font-medium">
        <span className="text-gray-300">#</span>
        {data.title}
        <span className="text-gray-300">#</span>
      </h2>

      {data.content && (
        <p className=" pr-2 py-2 whitespace-pre-wrap [word-break:break-word] text-gray-700 text-sm">
          {data.content.trim()}
        </p>
      )}

      {quote && (
        <div className="mt-2 mb-4 px-4 py-2 bg-gray-100 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="material-icons-round text-lg leading-none">warning</span>
            <p>{quote}</p>
          </div>
          <p className="text-right text-gray-400">{moment().calendar()}</p>
        </div>
      )}

      <div className="flex pt-1 border-t border-gray-200">
        <div className="flex-grow">
          <DiscussEmojis discussId={data.id} disable={meData?.me.id === data.userId} />
        </div>
        <button className="btn-reset-style p-1 rounded text-gray-500 text-sm leading-none hover:bg-gray-100 hover:text-gray-700">
          <span className="material-icons-outlined text-base leading-none">reply</span>回覆
        </button>
        <PostOptionsMenu isMyPost={meData?.me.id === data.userId ?? false} />
      </div>
    </Tile>
  )
}
