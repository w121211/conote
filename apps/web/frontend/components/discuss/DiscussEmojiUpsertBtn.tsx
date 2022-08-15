import React from 'react'
import {
  DiscussEmojiFragment,
  UpsertDiscussEmojiLikeMutation,
  useMyDiscussEmojiLikeQuery,
  useUpsertDiscussEmojiLikeMutation,
} from '../../../apollo/query.graphql'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import EmojiBtn from '../emoji/EmojiBtn'

type Props = {
  discussEmoji: DiscussEmojiFragment | undefined
  discussId: string
  emojiCode: EmojiCode
  type: 'panel' | 'normal'
  disabled?: boolean
  onMutationCreateCompleted?: (data: UpsertDiscussEmojiLikeMutation) => void
  onMutationUpdateCompleted?: (data: UpsertDiscussEmojiLikeMutation) => void
}

const CreateBtn = ({
  disabled,
  discussId,
  emojiCode,
  onMutationCreateCompleted,
}: Props) => {
  const [createEmoji] = useUpsertDiscussEmojiLikeMutation({
    variables: { discussId, emojiCode, liked: true },
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
  discussId,
  discussEmoji,
  type,
  disabled,
  onMutationUpdateCompleted,
}: Omit<Props, 'discussEmoji'> & {
  discussEmoji: DiscussEmojiFragment
}) => {
  const { data, refetch } = useMyDiscussEmojiLikeQuery({
    variables: { discussEmojiId: discussEmoji.id },
  })
  const [upsertEmoji] = useUpsertDiscussEmojiLikeMutation({
    onCompleted: data => {
      refetch()
      if (onMutationUpdateCompleted) onMutationUpdateCompleted(data)
    },
  })

  function onClick() {
    if (data?.myDiscussEmojiLike) {
      upsertEmoji({
        variables: {
          discussId,
          emojiId: parseInt(discussEmoji.id),
          liked: !data.myDiscussEmojiLike.liked,
        },
      })
    } else {
      upsertEmoji({
        variables: {
          discussId,
          emojiId: parseInt(discussEmoji.id),
          liked: true,
        },
      })
    }
  }

  if (type === 'panel') {
    return (
      <EmojiBtn
        onClick={onClick}
        emojiCode={discussEmoji.code}
        liked={data?.myDiscussEmojiLike?.liked}
        disabled={disabled}
      />
    )
  }
  return (
    <EmojiBtn
      onClick={onClick}
      emojiCode={discussEmoji.code}
      liked={data?.myDiscussEmojiLike?.liked}
      counts={discussEmoji.count.nUps}
      disabled={disabled}
    />
  )
}

const DiscussEmojiUpsertBtn = (props: Props) => {
  const { discussEmoji } = props
  if (discussEmoji) {
    return <UpdateBtn {...{ ...props, discussEmoji }} />
  }
  return <CreateBtn {...props} />
}

export default DiscussEmojiUpsertBtn
