import React, { useState } from 'react'
// import { EmojiCode } from 'graphql-let/__generated__/__types__'
import { NoteEmojisDocument, useCreateNoteEmojiMutation } from '../../apollo/query.graphql'
import { EmojiIcon } from './emoji-icon'
import { EmojiCode } from '@prisma/client'
import { EmojiBtn } from './emoji-btn'

const CreateNoteEmojiBtn = ({ noteId, emojiCode }: { noteId: string; emojiCode: EmojiCode }): JSX.Element => {
  const [createNoteEmoji] = useCreateNoteEmojiMutation({
    refetchQueries: [{ query: NoteEmojisDocument, variables: { noteId } }],
  })

  const onClick = () => {
    createNoteEmoji({ variables: { noteId, code: emojiCode } })
  }
  return (
    <EmojiBtn onClick={onClick} emojiCode={emojiCode} />
    // <button
    //   className={`btn-reset-style group p-1 rounded ${emojiCode === 'PIN' ? 'hover:bg-red-50' : 'hover:bg-blue-50'}`}
    //   onClick={() => {
    //     onClick()
    //   }}
    // >
    //   <EmojiIcon
    //     className={'text-gray-500'}
    //     code={emojiCode}
    //     upDownClassName="group-hover:text-blue-600"
    //     pinClassName="!text-xl !leading-none group-hover:text-red-600"
    //   />
    // </button>
  )
}
export default CreateNoteEmojiBtn
