import moment from 'moment'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import DiscussBody from './discuss-body'

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

const Discuss = ({ title }: { title: string }) => {
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
    <div className="flex flex-col gap-3 w-[50vw]">
      <h2 className="text-2xl font-bold">{title}</h2>

      <DiscussBody />
      <form
        className="sticky group gap-2 bottom-0 text-sm bg-white"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        autoCorrect="off"
      >
        <div
          contentEditable={true}
          ref={commentRef}
          onInput={e => {
            deleteEmptyChild()
            setValue('comments', e.currentTarget.textContent ?? '')
          }}
          className=" relative w-full h-6 px-2 my-2 rounded overflow-y-auto outline-none 
        focus:h-28 group-focus-within:h-28 focus:outline-none focus-visible:outline-none 
            empty:before:content-['留言...'] before:text-gray-400 transition-all 
            "
        />
        <div
          className="absolute -z-10 w-full h-10 group-focus-within:h-32 left-0 top-0 flex-grow flex items-center rounded 
          border border-gray-200
        bg-gray-100 "
        />
        <div className="hidden group-focus-within:block focus:block text-right pt-2 ">
          <button type="submit" className="btn-primary ">
            送出
          </button>
        </div>
      </form>
      {/* <div className="absolute inline-flex right-14 bottom-14 p-1 rounded-full bg-blue-600">
        <span className="material-icons text-4xl leading-none text-white">add</span>
      </div> */}
    </div>
  )
}

export default Discuss