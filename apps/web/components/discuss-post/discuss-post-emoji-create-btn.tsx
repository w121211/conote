import { EmojiCode } from '@prisma/client'
import React from 'react'
import {
  DiscussPostEmojisDocument,
  useUpsertDiscussPostEmojiLikeMutation,
} from '../../apollo/query.graphql'
import { EmojiBtn } from '../emoji/emoji-btn'

const DiscussPostEmojiCreateBtn = ({
  discussPostId,
  emojiCode,
}: {
  discussPostId: string
  emojiCode: EmojiCode
}) => {
  const [createEmoji, { error }] = useUpsertDiscussPostEmojiLikeMutation({
    variables: {
      discussPostId: parseInt(discussPostId),
      emojiCode: emojiCode,
      liked: true,
    },
    refetchQueries: [
      { query: DiscussPostEmojisDocument, variables: { discussPostId } },
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

export default DiscussPostEmojiCreateBtn
