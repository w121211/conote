import React, { useEffect } from 'react'
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
  onLiked,
  likedChoice,
}: {
  noteEmoji: NoteEmojiFragment
  showCounts?: boolean
  onLiked: (code: 'UP' | 'DOWN') => void
  likedChoice: 'UP' | 'DOWN' | null
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
    onError(error) {
      console.log(error.graphQLErrors)
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

    if (myLike) {
      upsertEmojiLike({
        variables: {
          noteEmojiId: noteEmoji.id,
          liked: !myLike.liked,
        },
      })
    }

    if (myLike === null) {
      upsertEmojiLike({
        variables: {
          noteEmojiId: noteEmoji.id,
          liked: true,
        },
      })
    }
    // upsertEmojiLike({variables:{hashtagId:foundEmoji.id,data:{choice:}}})
  }

  useEffect(() => {
    if (myEmojiLikeData?.myNoteEmojiLike?.liked && (noteEmoji.code === 'UP' || noteEmoji.code === 'DOWN')) {
      onLiked(noteEmoji.code)
    }
  }, [myEmojiLikeData])

  useEffect(() => {
    const myLike = myEmojiLikeData?.myNoteEmojiLike
    if (
      (noteEmoji.code === 'UP' || noteEmoji.code === 'DOWN') &&
      likedChoice &&
      noteEmoji.code !== likedChoice &&
      myLike?.liked
    ) {
      upsertEmojiLike({
        variables: {
          noteEmojiId: noteEmoji.id,
          liked: !myLike.liked,
        },
      })
    }
  }, [likedChoice])

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
        liked={myEmojiLikeData?.myNoteEmojiLike?.liked}
        upDownClassName="!text-lg !leading-none group-hover:text-blue-600"
        pinClassName="!text-xl !leading-none group-hover:text-red-600"
      />
      {showCounts && (
        <span
          className={`ml-[2px] text-sm  ${myEmojiLikeData?.myNoteEmojiLike?.liked ? 'text-blue-600' : 'text-gray-500'}`}
        >
          {noteEmoji.count.nUps}
        </span>
      )} */}
    </button>
  )
}
export default NoteEmojiBtn
