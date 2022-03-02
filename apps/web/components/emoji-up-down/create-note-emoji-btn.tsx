import React from 'react'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import { NoteEmojisDocument, useCreateNoteEmojiMutation } from '../../apollo/query.graphql'
import EmojiIcon from './emoji-icon'

const CreateNoteEmojiBtn = ({ noteId, emojiCode }: { noteId: string; emojiCode: EmojiCode }): JSX.Element => {
  const [createNoteEmoji] = useCreateNoteEmojiMutation({
    refetchQueries: [{ query: NoteEmojisDocument, variables: { noteId } }],
  })

  const handleLike = () => {
    createNoteEmoji({ variables: { noteId, code: emojiCode } })
  }
  return (
    // <div className="flex items-center gap-1">
    <button
      className={`btn-reset-style group p-1 rounded ${emojiCode === 'PIN' ? 'hover:bg-red-50' : 'hover:bg-blue-50'}`}
      onClick={() => {
        handleLike()
      }}
    >
      <EmojiIcon
        className={'text-gray-500'}
        code={emojiCode}
        upDownClassName="group-hover:text-blue-600"
        pinClassName="!text-xl !leading-none group-hover:text-red-600"
      />
    </button>
    // {/* <span
    //   className={`min-w-[10px] text-gray-500 text-sm font-['Red Hat Mono'] ${emojiCode === 'PIN' ? 'hidden' : ''}`}
    // >
    //   {0}
    // </span> */}
    // </div>
  )
}
export default CreateNoteEmojiBtn
