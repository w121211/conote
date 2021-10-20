import { useState } from 'react'
import PinIcon from '../../assets/svg/like.svg'
import UpIcon from '../../assets/svg/arrow-up.svg'
import { Emoji } from '../../apollo/query.graphql'
// import classes from './upDown.module.scss'

const EmojiTextToIcon = ({ emoji }: { emoji: Emoji }): JSX.Element => {
  switch (emoji.text) {
    case 'PIN':
      return <PinIcon />
    case 'UP':
      return <UpIcon />
    case 'DOWN':
      return <UpIcon style={{ transform: 'rotate(180deg)' }} />
    default:
      return <span>{emoji.text}</span>
  }
}

export default EmojiTextToIcon
