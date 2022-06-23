import React, { useEffect } from 'react'
import {
  NoteEmojiFragment,
  useMyNoteEmojiLikeQuery,
  useUpsertNoteEmojiLikeMutation,
} from '../../apollo/query.graphql'
import { EmojiBtn } from './emoji-btn'

const UpdateNoteEmojiBtn = ({
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
    // update(cache, { data }) {
    //   const res = cache.readQuery<MyNoteEmojiLikeQuery>({
    //     query: MyNoteEmojiLikeDocument,
    //   })
    //   // TODO: 這裡忽略了更新 count
    //   if (res && data?.upsertNoteEmojiLike) {
    //     cache.writeQuery<MyNoteEmojiLikeQuery, MyNoteEmojiLikeQueryVariables>({
    //       query: MyNoteEmojiLikeDocument,
    //       variables: { noteEmojiId: data.upsertNoteEmojiLike.like.id },
    //       data: { myNoteEmojiLike: data.upsertNoteEmojiLike.like },
    //     })
    //   }
    // },
    onCompleted(data) {
      // console.log(data.upsertEmojiLike)
    },
    onError(error) {
      console.debug(error.graphQLErrors)
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
          emojiId: parseInt(noteEmoji.id),
          liked: !myLike.liked,
        },
      })
    }

    if (myLike === null) {
      upsertEmojiLike({
        variables: {
          emojiId: parseInt(noteEmoji.id),
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
    // console.log(likedChoice)
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
  )
}
export default UpdateNoteEmojiBtn
