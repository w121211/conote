import moment from 'moment'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useDiscussPostsQuery } from '../../apollo/query.graphql'
import DiscussPostEmojis from './discuss-post-emojis'

const dummyData = [
  '測試測試大家好',
  '大家一起吃飯吧 哈哈哈 大家一起吃飯吧 哈哈哈 大家一起吃飯吧 哈哈哈 大家一起吃飯吧 哈哈哈 大家一起吃飯吧 哈哈哈',
  '好尷尬唷嗚嗚嗚',
  '好尷尬唷嗚嗚嗚',
  '好尷尬唷嗚嗚嗚',
]

interface DiscussFormInput {
  comments: string
}

const DiscussBody = ({ discussId }: { discussId: string }) => {
  const { data } = useDiscussPostsQuery({ variables: { discussId } })
  const { register, handleSubmit, setValue } = useForm<DiscussFormInput>({ defaultValues: { comments: '' } })
  const commentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    register('comments')
  }, [])

  const onSubmit = (d: DiscussFormInput) => {
    if (d.comments !== '') {
      console.log(d.comments)
    }
  }
  const deleteEmptyChild = () => {
    if (
      commentRef.current &&
      (commentRef.current.innerHTML === '<br>' || commentRef.current?.innerHTML === '<div><br></div>')
    ) {
      commentRef.current.innerHTML = ''
    }
  }
  const date = new Date()
  const formatDate = moment(date).subtract(10, 'days').calendar()
  return (
    <div>
      <h3 className=" my-2 font-medium">共{dummyData.length}則留言</h3>
      {data?.discussPosts.map((post, i) => {
        return (
          <div key={i} className="flex py-2 border-t last:border-b border-gray-100 text-sm ">
            <span className="material-icons mr-2 text-3xl leading-none text-gray-300">account_circle</span>
            <div>
              <span className="flex items-center ">
                {/* <span className="inline-block py-2 w-8 text-xs leading-5 align-bottom text-gray-500 font-light ">
                  #{i + 1}
                </span> */}
                {/* <span className="flex-grow flex items-center"> */}
                <span className="inline-block mr-1 text-gray-800 font-medium">{post.userId}</span>
                <span className="inline-block   text-gray-400 text-xs">
                  {moment(post.createdAt).subtract(10, 'days')}
                </span>
                <span className="inline-block text-right">
                  <DiscussPostEmojis discussPostId={post.id} />
                </span>
                {/* </span> */}
              </span>
              {/* <div className=""> */}
              <div className=" pr-2 py-2 break-all text-gray-800">{post.content}</div>

              {/* </div> */}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DiscussBody
