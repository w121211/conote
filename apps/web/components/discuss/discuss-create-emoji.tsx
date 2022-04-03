import { EmojiCode, LikeChoice } from '@prisma/client'
import React from 'react'
import {
  DiscussEmojisDocument,
  MyDiscussEmojiLikeDocument,
  useCreateDiscussEmojiMutation,
} from '../../apollo/query.graphql'
import { EmojiIcon } from '../emoji-up-down/emoji-icon'
import { EmojiBtn } from './layout-components/emoji-btn'

const CreateDiscussEmoji = ({ discussId, emojiCode }: { discussId: string; emojiCode: EmojiCode }) => {
  const [createEmoji, { error }] = useCreateDiscussEmojiMutation({
    variables: { discussId, code: emojiCode },
    refetchQueries: [{ query: DiscussEmojisDocument, variables: { discussId } }],
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
