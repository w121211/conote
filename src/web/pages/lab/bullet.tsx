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

const HashtagComponent = (props: { hashtag: Hashtag }): JSX.Element => {
  const { hashtag } = props
  const [createHashtagLike] = useCreateHashtagLikeMutation({
    // update(cache, { data }) {
    // const res = cache.readQuery<MyCommentLikesQuery>({ query: MyCommentLikesDocument })
    // if (res?.myCommentLikes && data?.createCommentLike) {
    //   cache.writeQuery<MyCommentLikesQuery>({
    //     query: MyCommentLikesDocument,
    //     data: { myCommentLikes: res.myCommentLikes.concat([data.createCommentLike.like]) },
    //   })
    // }
    // },
  })
  const [updateHashtagLike] = useUpdateHashtagLikeMutation({
    // update(cache, { data }) {
    // const res = cache.readQuery<MyCommentLikesQuery>({
    //   query: MyCommentLikesDocument,
    // })
    // if (res?.myCommentLikes && data?.updateCommentLike) {
    //   cache.writeQuery<MyCommentLikesQuery>({
    //     query: MyCommentLikesDocument,
    //     data: { myCommentLikes: res.myCommentLikes.concat([data.updateCommentLike.like]) },
    //   })
    // }
    // },
  })
  const { data, loading, error } = useMyHashtagLikeQuery({ variables: { hashtagId: hashtag.id } })

  function handleClickLike(choice: LikeChoice) {
    if (data === undefined) {
      return
    }
    const { myHashtagLike } = data
    if (myHashtagLike && myHashtagLike.choice === choice) {
      updateHashtagLike({
        variables: {
          id: myHashtagLike.id,
          data: { choice: 'NEUTRAL' },
        },
      })
    }
    if (myHashtagLike && myHashtagLike.choice !== choice) {
      updateHashtagLike({
        variables: {
          id: myHashtagLike.id,
          data: { choice },
        },
      })
    }
    if (myHashtagLike === undefined) {
      createHashtagLike({
        variables: {
          hashtagId: hashtag.id.toString(),
          data: { choice },
        },
      })
    }
  }
  return (
    <div>
      {hashtag.text}
      <button
        onClick={() => {
          handleClickLike('DOWN')
        }}
      >
        up
      </button>
      <button
        onClick={() => {
          handleClickLike('DOWN')
        }}
      >
        down
      </button>
    </div>
  )
}

const HashtagGroupComponent = (props: { hashtagGroup: HashtagGroup }): JSX.Element => {
  const { hashtagGroup: group } = props
  return (
    <span>
      {group.poll.choices.map((e, i) => (
        <button key={i}>{e}</button>
      ))}
    </span>
  )
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
