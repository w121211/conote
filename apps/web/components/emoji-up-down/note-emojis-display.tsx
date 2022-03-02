import React from 'react'
import {
  NoteEmojiFragment,
  MyNoteEmojiLikeDocument,
  MyNoteEmojiLikeQuery,
  MyNoteEmojiLikeQueryVariables,
  useNoteEmojisQuery,
  useMyNoteEmojiLikeQuery,
  useUpsertNoteEmojiLikeMutation,
} from '../../apollo/query.graphql'
import EmojiIcon from './emoji-icon'

const NoteEmojiDisplay = ({ noteEmoji }: { noteEmoji: NoteEmojiFragment }): JSX.Element | null => {
  const {
    data: myEmojiLikeData,
    loading,
    error,
  } = useMyNoteEmojiLikeQuery({
    variables: { noteEmojiId: noteEmoji.id },
  })

  if (noteEmoji.count.nUps === 0) return null
  return (
    <button className={`btn-reset-style`}>
      {/* {data.myHashtagLike?.choice && hashtag.text} */}
      {/* {hashtag.text} */}
      <EmojiIcon
        className="hover:text-gray-500"
        code={noteEmoji.code}
        nUps={noteEmoji.count.nUps}
        liked={myEmojiLikeData?.myNoteEmojiLike?.choice === 'UP'}
      />
    </button>
  )
}

const NoteEmojis = ({ noteId }: { noteId: string }): JSX.Element | null => {
  const { data, error, loading } = useNoteEmojisQuery({ fetchPolicy: 'cache-first', variables: { noteId } })
  if (!data || error || loading || data?.noteEmojis.length === 0 || data.noteEmojis.every(e => e.count.nUps === 0)) {
    return null
  }
  return (
    <div className="inline-flex">
      {data.noteEmojis.map((e, i) => {
        return <NoteEmojiDisplay key={i} noteEmoji={e} />
      })}
    </div>
  )
}
export default NoteEmojis
