import { BulletEmojiFragment, useBulletEmojisQuery } from '../../apollo/query.graphql'
import BulletEmojiButton from './bullet-emoji-button'
import classes from './emoji-up-down.module.scss'

const sortBulletEmojis = (emojis: BulletEmojiFragment[]): BulletEmojiFragment[] => {
  const order = ['PIN', 'UP', 'DOWN']
  emojis.sort((a, b) => order.indexOf(a.code) - order.indexOf(b.code))
  return emojis
}

const BulletEmojiButtonGroup = ({ bulletId }: { bulletId: string }): JSX.Element | null => {
  const { data, loading, error } = useBulletEmojisQuery({ variables: { bulletId } })
  if (loading) {
    return null
  }
  if (error || data === undefined) {
    return <p>Unexpected error</p>
  }
  if (data.bulletEmojis.length === 0 || data.bulletEmojis.every(e => e.count.nUps === 0)) {
    return null
  }
  return (
    <span className={classes.bulletPointEmojisContainer} contentEditable={false}>
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
