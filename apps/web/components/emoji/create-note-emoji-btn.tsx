import React, { useState } from 'react'
// import { EmojiCode } from 'graphql-let/__generated__/__types__'
import {
  NoteEmojisDocument,
  useUpsertNoteEmojiLikeMutation,
} from '../../apollo/query.graphql'
import { EmojiIcon } from './emoji-icon'
import { EmojiCode } from '@prisma/client'
import { EmojiBtn } from './emoji-btn'

const CreateNoteEmojiBtn = ({
  noteId,
  emojiCode,
}: {
  noteId: string
  emojiCode: EmojiCode
}): JSX.Element => {
  const [createNoteEmoji] = useUpsertNoteEmojiLikeMutation({
    refetchQueries: [{ query: NoteEmojisDocument, variables: { noteId } }],
  })

  const onClick = () => {
    createNoteEmoji({
      variables: { noteId, emojiCode: emojiCode, liked: true },
    })
  }
  return <EmojiBtn onClick={onClick} emojiCode={emojiCode} />
}
export default CreateNoteEmojiBtn
