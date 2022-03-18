import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useDiscussQuery } from '../../apollo/query.graphql'
import DiscussBody from './post/discuss-posts'
import DiscussEmojis from './discuss-emojis'
import DiscussHeader from './discuss-header'
import CreatePostForm from './post/create-post-form'

const dummyData = [
  '測試測試大家好',
  '大家一起吃飯吧 哈哈哈 大家一起吃飯吧 哈哈哈 大家一起吃飯吧 哈哈哈 大家一起吃飯吧 哈哈哈 大家一起吃飯吧 哈哈哈',
  '好尷尬唷嗚嗚嗚',
  '好尷尬唷嗚嗚嗚',
  '好尷尬唷嗚嗚嗚',
]

const DiscussFullPage = ({ id }: { id: string }) => {
  const { data } = useDiscussQuery({ variables: { id } })

  // console.log(id)
  // console.log(data)

  if (!data?.discuss) {
    return null
  }
  return (
    <div className="flex flex-col gap-3 w-full">
      <DiscussHeader data={data.discuss} />
      <DiscussBody discussId={data.discuss.id} />
      <CreatePostForm discussId={data.discuss.id} type="page" />
    </div>
  )
}

export default DiscussFullPage
