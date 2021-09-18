import React, { useEffect, useState } from 'react'
import {
  HashtagLike,
  LikeChoice,
  useCreateHashtagLikeMutation,
  useMyHashtagLikeQuery,
  useUpdateHashtagLikeMutation,
} from '../../apollo/query.graphql'
import { Hashtag, HashtagGroup } from '../../lib/hashtag/types'
import { Bullet, RootBullet } from '../../lib/bullet/types'

const root: RootBullet = {
  id: 1,
  timestamp: 1001,
  userIds: ['bot'],
  head: 'root',
  root: true,
  symbol: '[[ROOT]]',
  children: [],
}

const BulletComponent = (props: { bullet: Bullet; editing: boolean }): JSX.Element => {
  const { bullet, editing } = props
  if (editing) {
    // const hashtagsText = bullet.hashtags
    //   ?.reduce((acc, cur) => {
    //     return cur.text + ' '
    //   }, '')
    //   .trim()
    // const text = hashtagsText ? `${bullet.head} ${hashtagsText}` : bullet.head
    // return <span>{text}</span>
    return <span></span>
  }
  return (
    <span>
      {bullet.head}
      {/* {bullet.hashtags &&
        bullet.hashtags.map((e, i) => {
          if (e.type === 'hashtag') {
            return <HashtagComponent key={i} hashtag={e} />
          }
          if (e.type === 'hashtag-group') {
            return <HashtagGroupComponent key={i} hashtagGroup={e} />
          }
        })} */}
    </span>
  )
}

const TestPage = (): JSX.Element => {
  const [editing, setEditing] = useState(false)
  return (
    <div>
      <button
        onClick={() => {
          setEditing(!editing)
        }}
      >
        editing {editing}
      </button>
      <BulletComponent bullet={root} editing={editing} />
    </div>
  )
}

export default TestPage