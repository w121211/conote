import { EmojiCode } from 'graphql-let/__generated__/__types__'
import {
  BulletEmojisDocument,
  BulletEmojisQuery,
  BulletEmojisQueryVariables,
  useCreateBulletEmojiMutation,
} from '../../apollo/query.graphql'
import EmojiIcon from './emoji-icon'
import Popup from '../popup/popup'

const BulletEmojiCreateButton = ({
  bulletId,
  className,
  emojiCode,
}: {
  bulletId: string
  className?: string
  emojiCode: EmojiCode
} & React.HTMLAttributes<HTMLElement>): JSX.Element => {
  const [createBulletEmoji, { error }] = useCreateBulletEmojiMutation({
    variables: { bulletId, code: emojiCode },

    update(cache, { data }) {
      const res = cache.readQuery<BulletEmojisQuery, BulletEmojisQueryVariables>({
        query: BulletEmojisDocument,
        variables: { bulletId },
      })
      if (data?.createBulletEmoji) {
        if (res?.bulletEmojis.find(e => e.id === data.createBulletEmoji.emoji.id)) {
          //
        } else {
          cache.writeQuery<BulletEmojisQuery, BulletEmojisQueryVariables>({
            query: BulletEmojisDocument,
            variables: { bulletId },
            data: { bulletEmojis: (res?.bulletEmojis ?? []).concat(data.createBulletEmoji.emoji) },
          })
        }
      }
      // if (!res?.bulletEmojis && data?.createBulletEmoji) {
      //   cache.writeQuery<BulletEmojisQuery, BulletEmojisQueryVariables>({
      //     query: BulletEmojisDocument,
      //     variables: { bulletId },
      //     data: { bulletEmojis: data.createBulletEmoji.emoji },
      //   })
      // }
      // else refetchBulletEmojis()
    },

    // TODO: 避免使用 @see https://www.apollographql.com/blog/apollo-client/caching/when-to-use-refetch-queries/
    // refetchQueries: [{ query: BulletEmojisDocument, variables: { bulletId } }],

    onError(error) {
      console.error(error.message)
    },
    // refetchQueries: _ => [{ query: BulletEmojisDocument, variables: { bulletId } }],
  })

  if (error) {
    if (error.graphQLErrors.find(e => e.extensions.code === 'UNAUTHENTICATED')) {
      return (
        <Popup
          visible={true}
          hideBoard={() => {
            //
          }}
        >
          尚未登入
        </Popup>
      )
    }
  }
  return (
    <>
      <button
        className={`btn-reset-style flex ${className ? className : ''} `}
        onClick={e => {
          e.stopPropagation()
          createBulletEmoji()
        }}
      >
        <EmojiIcon code={emojiCode} showText />
      </button>
    </>
  )
}

export default BulletEmojiCreateButton
