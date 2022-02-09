import moment from 'moment'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import DiscussBody from './discuss-body'
import DiscussEmojis from './discuss-emojis'

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

const DiscussFullPage = ({ title }: { title: string }) => {
  const { register, handleSubmit, setValue } = useForm<DiscussFormInput>({ defaultValues: { comments: '' } })
  const commentRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
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
  const formScrollIntoView = () => {
    console.log(formRef.current?.getBoundingClientRect().bottom)
    formRef.current && formRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
  }
  const date = new Date()
  const formatDate = moment(date).subtract(10, 'days').calendar()
  return (
    <div className="flex flex-col gap-3 w-full">
      <h2 className="text-2xl font-bold">{title}</h2>

      <DiscussBody />
      <form
        className="relative gap-2 bottom-0 text-sm scroll-mb-10"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        autoCorrect="off"
        ref={formRef}
      >
        {/* <textarea
          {...register('comments')}
          className=" resize-none w-full h-auto p-2 text-sm focus:outline-none focus:bg-gray-100 hover:bg-gray-100"
          placeholder="留言"
        /> */}

        <div
          contentEditable={true}
          ref={commentRef}
          onInput={e => {
            deleteEmptyChild()
            setValue('comments', e.currentTarget.textContent ?? '')
          }}
          onFocus={e => {
            e.preventDefault()
            e.target.focus({ preventScroll: true })
          }}
          onKeyUp={e => {
            if (formRef.current && formRef.current.getBoundingClientRect().bottom > 790) {
              formScrollIntoView()
            }
          }}
          className=" relative w-full px-2 py-2 rounded  outline-none 
        min-h-[7rem] max-h-72 overflow-y-auto bg-gray-100 focus:outline-none focus-visible:outline-none 
            empty:before:content-['留言...'] before:text-gray-400 
            "
        />

        <div className=" text-right pt-2 ">
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

export default DiscussFullPage
