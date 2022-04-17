import { EmojiCode, LikeChoice } from '@prisma/client'
import React from 'react'
import { DiscussPostEmojisDocument, useCreateDiscussPostEmojiMutation } from '../../../apollo/query.graphql'
import { EmojiIcon } from '../../emoji-up-down/emoji-icon'
import { EmojiBtn } from '../layout-components/emoji-btn'

const CreateDiscussPostEmoji = ({ discussPostId, emojiCode }: { discussPostId: string; emojiCode: EmojiCode }) => {
  const [createEmoji, { error }] = useCreateDiscussPostEmojiMutation({
    variables: { discussPostId, code: emojiCode },
    refetchQueries: [{ query: DiscussPostEmojisDocument, variables: { discussPostId } }],
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
