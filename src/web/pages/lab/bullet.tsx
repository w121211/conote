import React, { useState } from 'react'
import { Hashtag, HashtagGroup } from '../../lib/bullet/hashtag'
import { Bullet, RootBullet } from '../../lib/bullet/types'

const root: RootBullet = {
  id: 1,
  timestamp: 1001,
  userIds: ['bot'],
  head: 'root',
  root: true,
  symbol: '[[ROOT]]',
  children: [],
  hashtags: [
    { type: 'hashtag', id: 1, bulletId: 10, cardId: 3, userId: 'bot', authorName: null, text: '#up' },
    {
      type: 'hashtag-group',
      id: 2,
      userId: 'bot',
      bulletId: 10,
      cardId: 3,
      authorName: null,
      text: '(#a #b)',
      poll: {
        id: 10,
        userId: 'aaa',
        choices: ['#a', '#b'],
        count: { id: 1, nVotes: [10, 23] },
      },
    },
  ],
}

const HashtagComponent = (props: { hashtag: Hashtag }): JSX.Element => {
  const { hashtag } = props
  return <button>{hashtag.text}</button>
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
    const hashtagsText = bullet.hashtags
      ?.reduce((acc, cur) => {
        return cur.text + ' '
      }, '')
      .trim()
    const text = hashtagsText ? `${bullet.head} ${hashtagsText}` : bullet.head
    return <span>{text}</span>
  }
  return (
    <span>
      {bullet.head}
      {bullet.hashtags &&
        bullet.hashtags.map((e, i) => {
          if (e.type === 'hashtag') {
            return <HashtagComponent key={i} hashtag={e} />
          }
          if (e.type === 'hashtag-group') {
            return <HashtagGroupComponent key={i} hashtagGroup={e} />
          }
        })}
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
