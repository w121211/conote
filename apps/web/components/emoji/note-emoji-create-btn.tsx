import React, { useState } from 'react'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import {
  NoteEmojisDocument,
  useUpsertNoteEmojiLikeMutation,
} from '../../apollo/query.graphql'
import { EmojiBtn } from './emoji-btn'

export const NoteEmojiBtn = ({
  noteId,
  emojiCode,
}: {
  noteId: string
  emojiCode: EmojiCode
}): JSX.Element => {
  const [upserNoteEmoji] = useUpsertNoteEmojiLikeMutation({
    refetchQueries: [{ query: NoteEmojisDocument, variables: { noteId } }],
  })
  const onClick = () => {
    upserNoteEmoji({
      variables: { noteId, emojiCode: 'PIN', liked: true },
    })
  }

  return <EmojiBtn onClick={onClick} emojiCode="PIN" />
}
