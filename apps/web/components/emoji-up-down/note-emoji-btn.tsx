import React from 'react'
import { LikeChoice } from 'graphql-let/__generated__/__types__'
import {
  NoteEmojiFragment,
  MyNoteEmojiLikeDocument,
  MyNoteEmojiLikeQuery,
  MyNoteEmojiLikeQueryVariables,
  useMyNoteEmojiLikeQuery,
  useUpsertNoteEmojiLikeMutation,
} from '../../apollo/query.graphql'
import EmojiIcon from './emoji-icon'

const NoteEmojiBtn = ({
  noteEmoji,
  showCounts,
}: {
  noteEmoji: NoteEmojiFragment
  showCounts?: boolean
}): JSX.Element => {
  const [upsertEmojiLike] = useUpsertNoteEmojiLikeMutation({
    update(cache, { data }) {
      const res = cache.readQuery<MyNoteEmojiLikeQuery>({
        query: MyNoteEmojiLikeDocument,
      })
      // TODO: 這裡忽略了更新 count
      if (res && data?.upsertNoteEmojiLike) {
        cache.writeQuery<MyNoteEmojiLikeQuery, MyNoteEmojiLikeQueryVariables>({
          query: MyNoteEmojiLikeDocument,
          variables: { noteEmojiId: data.upsertNoteEmojiLike.like.id },
          data: { myNoteEmojiLike: data.upsertNoteEmojiLike.like },
        })
      }
    },
    onCompleted(data) {
      // console.log(data.upsertEmojiLike)
    },
  })

  const {
    data: myEmojiLikeData,
    loading,
    error,
  } = useMyNoteEmojiLikeQuery({
    variables: { noteEmojiId: noteEmoji.id },
  })

  const handleLike = (choice: LikeChoice = 'UP') => {
    const myLike = myEmojiLikeData?.myNoteEmojiLike

    // if (myLike && myLike.choice === choice) {
    //   upsertEmojiLike({
    //     variables: {
    //       noteEmojiId: noteEmoji.id,
    //       data: { choice: 'NEUTRAL' },
    //     },
    //   })
    // }
    // if (myLike && myLike.choice !== choice) {
    //   upsertEmojiLike({
    //     variables: {
    //       noteEmojiId: noteEmoji.id,
    //       data: { choice },
    //     },
    //   })
    // }
    // if (myLike === null) {
    //   upsertEmojiLike({
    //     variables: {
    //       noteEmojiId: noteEmoji.id,
    //       data: { choice },
    //     },
    //   })
    // }
    // upsertEmojiLike({variables:{hashtagId:foundEmoji.id,data:{choice:}}})
  }
  return (
    <button
      className={`btn-reset-style group p-1 rounded ${
        noteEmoji.code === 'PIN' ? 'hover:bg-red-50' : 'hover:bg-blue-50'
      }`}
      onClick={() => {
        handleLike('UP')
      }}
    >
      {/* <EmojiIcon
        className={'text-gray-500'}
        code={noteEmoji.code}
        liked={myEmojiLikeData?.myNoteEmojiLike?.choice === 'UP'}
        upDownClassName="!text-lg !leading-none group-hover:text-blue-600"
        pinClassName="!text-xl !leading-none group-hover:text-red-600"
      />
      {showCounts && (
        <span
          className={`ml-[2px] text-sm  ${
            myEmojiLikeData?.myNoteEmojiLike?.choice === 'UP' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          {noteEmoji.count.nUps}
        </span>
      )} */}
    </button>
  )
}
export default NoteEmojiBtn
