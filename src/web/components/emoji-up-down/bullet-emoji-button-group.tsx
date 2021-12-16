import { BulletEmojiFragment, useBulletEmojisQuery } from '../../apollo/query.graphql'

import BulletEmojiButton from './bullet-emoji-button'

const sortBulletEmojis = (emojis: BulletEmojiFragment[]): BulletEmojiFragment[] => {
  const order = ['PIN', 'UP', 'DOWN']
  const clone = require('rfdc/default')
  const arr: BulletEmojiFragment[] = clone(emojis)
  arr.sort((a, b) => order.indexOf(a.code) - order.indexOf(b.code))
  console.log(arr)
  return arr
}

const BulletEmojiButtonGroup = ({ bulletId }: { bulletId: string }): JSX.Element | null => {
  const { data, loading, error } = useBulletEmojisQuery({ variables: { bulletId } })
  if (loading) {
    return null
  }
  if (error) {
    return <p>Unexpected error</p>
  }
  if (data === undefined) {
    return null
  }
  if (data.bulletEmojis.length === 0 || data.bulletEmojis.every(e => e.count.nUps === 0)) {
    return null
  }
  return (
    <span className="inline-flex gap-2 ml-4 align-middle" contentEditable={false}>
      {sortBulletEmojis(data.bulletEmojis).map((e, i) => {
        if (e.count.nUps === 0) {
          return null
        }
        return <BulletEmojiButton key={i} emoji={e} />
      })}
    </span>
  )
}

export default BulletEmojiButtonGroup
