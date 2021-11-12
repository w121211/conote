import { useState } from 'react'
import PinIcon from '../../assets/svg/like.svg'
import UpIcon from '../../assets/svg/arrow-up.svg'
import { Emoji } from '../../apollo/query.graphql'
import { EmojiText } from '../../apollo/type-defs.graphqls'
// import classes from './upDown.module.scss'

const EmojiTextToIcon = ({ emoji, emojiText }: { emoji?: Emoji; emojiText?: EmojiText }): JSX.Element | null => {
  if (emoji) {
    switch (emoji.text) {
      case 'PIN':
        return <span>❤️</span>
      case 'UP':
        return <span>👍</span>
      case 'DOWN':
        return <span>👎</span>
      default:
        return <span>{emoji.text}</span>
    }
  }
  if (emojiText) {
    switch (emojiText) {
      case 'PIN':
        return <span>❤️</span>
      case 'UP':
        return <span>👍</span>
      case 'DOWN':
        return <span>👎</span>
      default:
        return <span>{emojiText}</span>
    }
  }
  return null
}

export default EmojiTextToIcon
