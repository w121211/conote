import { useState } from 'react'
import PinIcon from '../../assets/svg/like.svg'
import UpIcon from '../../assets/svg/arrow-up.svg'
// import classes from './upDown.module.scss'
import { Hashtag, HashtagGroup } from '../../lib/hashtag/types'

const HashtagTextToIcon = ({ hashtag }: { hashtag: Hashtag }): JSX.Element => {
  switch (hashtag.text) {
    case '#pin':
      return <PinIcon width="1em" height="1em" />
    case '#up':
      return <UpIcon width="1em" height="1em" />
    case '#down':
      return <UpIcon width="1em" height="1em" style={{ transform: 'rotate(180deg)' }} />
    default:
      return <span>{hashtag.text}</span>
  }
}

export default HashtagTextToIcon
