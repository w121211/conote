import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateDiscussMutation, DiscussFragment } from '../../apollo/query.graphql'

interface FormInput {
  title: string
  content?: string
}

const CreateDiscussForm = ({
  cardId,
  title,
  onCreated,
}: {
  cardId: string
  title: string
  onCreated: (data: DiscussFragment) => void
}) => {
  const { handleSubmit, register, setValue } = useForm<FormInput>({ defaultValues: { title } })
  const contentRef = useRef<HTMLDivElement>(null)
  const [createDiscuss] = useCreateDiscussMutation({
    onCompleted(data) {
      if (data.createDiscuss) {
        onCreated(data.createDiscuss)
      }
    },
  })
  const deleteEmptyChild = () => {
    if (
      contentRef.current &&
      (contentRef.current.innerHTML === '<br>' || contentRef.current?.innerHTML === '<div><br></div>')
    ) {
      contentRef.current.innerHTML = ''
    }
  }
  const onSubmit = (v: FormInput) => {
    console.log(v, cardId)
    createDiscuss({
      variables: {
        cardId,
        data: {
          title: v.title,
          content: v.content ?? '',
          //   meta: undefined,
        },
      },
    })
  }
  return (
    <form
      id="create-discuss-form"
      className="grid auto-rows-min min-w-[40vw] gap-4"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <input
        {...register('title', { required: true })}
        className="text-2xl font-bold focus:outline-none"
        type="text"
        placeholder="標題"
      />
      <div
        contentEditable={true}
        onInput={e => {
          deleteEmptyChild()
          setValue('content', e.currentTarget.textContent ?? '')
        }}
        className="min-h-[80px] bg-gray-100 rounded px-2 py-1 outline-none focus:outline-none empty:before:content-['詳述(選填)'] before:text-gray-400 before:text-sm "
        ref={contentRef}
      />
      {/* <textarea {...register('content')} className="text-sm" placeholder="詳述(選填)" rows={4} /> */}
    </form>
  )
}

export default CreateDiscussForm
