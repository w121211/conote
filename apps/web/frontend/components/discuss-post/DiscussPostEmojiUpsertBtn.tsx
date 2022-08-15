import React from 'react'
import {
  DiscussPostEmojiFragment,
  UpsertDiscussPostEmojiLikeMutation,
  useMyDiscussPostEmojiLikeQuery,
  useUpsertDiscussPostEmojiLikeMutation,
} from '../../../apollo/query.graphql'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import EmojiBtn from '../emoji/EmojiBtn'

type Props = {
  discussPostEmoji: DiscussPostEmojiFragment | undefined
  discussPostId: string
  emojiCode: EmojiCode
  type: 'panel' | 'normal'
  disabled?: boolean
  onMutationCreateCompleted?: (data: UpsertDiscussPostEmojiLikeMutation) => void
  onMutationUpdateCompleted?: (data: UpsertDiscussPostEmojiLikeMutation) => void
}

const CreateBtn = ({
  disabled,
  discussPostId,
  emojiCode,
  onMutationCreateCompleted,
}: Props) => {
  const [createEmoji] = useUpsertDiscussPostEmojiLikeMutation({
    variables: {
      discussPostId: parseInt(discussPostId),
      emojiCode,
      liked: true,
    },
    onCompleted: data => {
      if (onMutationCreateCompleted) onMutationCreateCompleted(data)
    },
  })
  return (
    <EmojiBtn
      onClick={() => createEmoji()}
      emojiCode={emojiCode}
      disabled={disabled}
    />
  )
}

const UpdateBtn = ({
  discussPostId,
  discussPostEmoji,
  type,
  disabled,
  onMutationUpdateCompleted,
}: Omit<Props, 'discussPostEmoji'> & {
  discussPostEmoji: DiscussPostEmojiFragment
}) => {
  const { data, refetch } = useMyDiscussPostEmojiLikeQuery({
    variables: { discussPostEmojiId: discussPostEmoji.id },
  })
  const [upsertEmoji] = useUpsertDiscussPostEmojiLikeMutation({
    onCompleted: data => {
      refetch()
      if (onMutationUpdateCompleted) onMutationUpdateCompleted(data)
    },
  })

  function onClick() {
    if (data?.myDiscussPostEmojiLike) {
      upsertEmoji({
        variables: {
          discussPostId: parseInt(discussPostId),
          emojiId: parseInt(discussPostEmoji.id),
          liked: !data.myDiscussPostEmojiLike.liked,
        },
      })
    } else {
      upsertEmoji({
        variables: {
          discussPostId: parseInt(discussPostId),
          emojiId: parseInt(discussPostEmoji.id),
          liked: true,
        },
      })
    }
  }

  if (type === 'panel') {
    return (
      <EmojiBtn
        onClick={onClick}
        emojiCode={discussPostEmoji.code}
        liked={data?.myDiscussPostEmojiLike?.liked}
        disabled={disabled}
      />
    )
  }
  return (
    <EmojiBtn
      onClick={onClick}
      emojiCode={discussPostEmoji.code}
      liked={data?.myDiscussPostEmojiLike?.liked}
      counts={discussPostEmoji.count.nUps}
      disabled={disabled}
    />
  )
}

const DiscussPostEmojiUpsertBtn = (props: Props) => {
  const { discussPostEmoji } = props
  if (discussPostEmoji) {
    return <UpdateBtn {...{ ...props, discussPostEmoji }} />
  }
  return <CreateBtn {...props} />
}

export default DiscussPostEmojiUpsertBtn
