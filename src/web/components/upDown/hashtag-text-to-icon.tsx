import { useState } from 'react'
import PinIcon from '../../assets/svg/like.svg'
import UpIcon from '../../assets/svg/arrow-up.svg'
import { Hashtag } from '../../apollo/query.graphql'
// import classes from './upDown.module.scss'

const HashtagTextToIcon = ({ hashtag }: { hashtag: Hashtag }): JSX.Element => {
  switch (hashtag.text) {
    case 'PIN':
      return <PinIcon />
    case 'UP':
      return <UpIcon />
    case 'DOWN':
      return <UpIcon style={{ transform: 'rotate(180deg)' }} />
    default:
      return <span>{hashtag.text}</span>
  }
}

export default HashtagTextToIcon
