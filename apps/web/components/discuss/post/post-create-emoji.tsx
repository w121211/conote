import { EmojiCode } from '@prisma/client'
import React from 'react'
import {
  DiscussPostEmojisDocument,
  useUpsertDiscussPostEmojiLikeMutation,
} from '../../../apollo/query.graphql'
// import { EmojiIcon } from '../../emoji-up-down/emoji-icon'
import { EmojiBtn } from '../layout-components/emoji-btn'

const CreateDiscussPostEmoji = ({
  discussPostId,
  emojiCode,
}: {
  discussPostId: number
  emojiCode: EmojiCode
}) => {
  const [createEmoji, { error }] = useUpsertDiscussPostEmojiLikeMutation({
    variables: { discussPostId, emojiCode: emojiCode, liked: true },
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

export default CreateDiscussPostEmoji
