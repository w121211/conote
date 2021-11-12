import React from 'react'
import { EmojisDocument, EmojiText, LikeChoice, useCreateEmojiMutation } from '../../apollo/query.graphql'
import EmojiTextToIcon from './emoji-text-to-icon'
import classes from './emoji-up-down.module.scss'

const CreateEmojiBtn = ({ bulletId, emojiText }: { bulletId: string; emojiText: EmojiText }) => {
  const [createEmoji] = useCreateEmojiMutation({
    // variables: { bulletId, emojiText },
    onCompleted(data) {
      // const { emoji, like } = data.createEmoji
      // // onEmojiCreated(emoji, like)
    },
    refetchQueries: [{ query: EmojisDocument, variables: { bulletId } }],
  })
  const handleLike = (choice: LikeChoice) => {
    createEmoji({ variables: { bulletId, text: emojiText } })
  }
  return (
    <button
      className={`inline ${classes.hashtag}`}
      onClick={() => {
        handleLike('UP')
      }}
    >
      {/* {data.myHashtagLike?.choice && hashtag.text} */}
      {/* {hashtag.text} */}
      <EmojiTextToIcon emojiText={emojiText} />

      <span style={{ marginLeft: '3px' }}>0</span>
    </button>
  )
}
export default CreateEmojiBtn
