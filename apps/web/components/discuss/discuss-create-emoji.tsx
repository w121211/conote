import React from 'react'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import {
  DiscussEmojisDocument,
  MyDiscussEmojiLikeDocument,
  useUpsertDiscussEmojiLikeMutation,
} from '../../apollo/query.graphql'
import { EmojiBtn } from './layout-components/emoji-btn'

const CreateDiscussEmoji = ({
  discussId,
  emojiCode,
}: {
  discussId: string
  emojiCode: EmojiCode
}) => {
  const [createEmoji, { error }] = useUpsertDiscussEmojiLikeMutation({
    variables: { discussId, emojiCode: emojiCode, liked: true },
    refetchQueries: [
      { query: DiscussEmojisDocument, variables: { discussId } },
    ],
  })
  const onClick = () => {
    createEmoji()
  }
  if (error) {
    console.log(error.message)
  }

  return <EmojiBtn onClick={onClick} emojiCode={emojiCode} />
}

export default CreateDiscussEmoji
