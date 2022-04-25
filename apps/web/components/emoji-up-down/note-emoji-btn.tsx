import { LikeChoice } from '@prisma/client'
import React, { useEffect } from 'react'
// import { LikeChoice } from 'graphql-let/__generated__/__types__'
import {
  NoteEmojiFragment,
  MyNoteEmojiLikeDocument,
  MyNoteEmojiLikeQuery,
  MyNoteEmojiLikeQueryVariables,
  useMyNoteEmojiLikeQuery,
  useUpsertNoteEmojiLikeMutation,
} from '../../apollo/query.graphql'
import { EmojiBtn } from './emoji-btn'
import { EmojiIcon } from './emoji-icon'

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

  const onClick = () => {
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
    if (
      myEmojiLikeData?.myNoteEmojiLike?.liked &&
      (noteEmoji.code === 'UP' || noteEmoji.code === 'DOWN')
    ) {
      // onLiked(noteEmoji.code)
    }
  }, [myEmojiLikeData])

  useEffect(() => {
    const myLike = myEmojiLikeData?.myNoteEmojiLike
    console.log(likedChoice)
    // if (
    //   (noteEmoji.code === 'UP' || noteEmoji.code === 'DOWN') &&
    //   likedChoice &&
    //   noteEmoji.code !== likedChoice &&
    //   myLike?.liked
    // ) {
    //   upsertEmojiLike({
    //     variables: {
    //       noteEmojiId: noteEmoji.id,
    //       liked: !myLike.liked,
    //     },
    //   })
    // }
  }, [likedChoice])

  if (showCounts) {
    return (
      <EmojiBtn
        onClick={onClick}
        emojiCode={noteEmoji.code}
        liked={myEmojiLikeData?.myNoteEmojiLike?.liked}
      />
    )
  }

  return (
    <EmojiBtn
      onClick={onClick}
      emojiCode={noteEmoji.code}
      liked={myEmojiLikeData?.myNoteEmojiLike?.liked}
      counts={noteEmoji.count.nUps}
    />
    // <button
    //   className={` group p-1 rounded ${
    //     noteEmoji.code === 'PIN' ? 'hover:bg-red-50' : 'hover:bg-gray-100'
    //   }`}
    //   onClick={() => {
    //     onClick()
    //   }}
    // >
    //   <EmojiIcon
    //     className={'text-gray-500'}
    //     code={noteEmoji.code}
    //     liked={myEmojiLikeData?.myNoteEmojiLike?.liked}
    //     upDownClassName="!text-lg !leading-none "
    //     pinClassName="!text-xl !leading-none group-hover:text-red-600"
    //   />
    //   {showCounts && <span className={`ml-[2px] text-sm`}>{noteEmoji.count.nUps}</span>}
    // </button>
  )
}
export default NoteEmojiBtn
