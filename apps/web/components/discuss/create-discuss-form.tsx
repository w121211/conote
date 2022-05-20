import React, { useLayoutEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import {
  DiscussFragment,
  useCreateDiscussMutation,
} from '../../apollo/query.graphql'

interface FormInput {
  title: string
  content?: string
}

const CreateDiscussForm = ({
  noteId,
  title,
  onCreate,
}: {
  noteId?: string
  title: string
  onCreate: (data: DiscussFragment) => void
}) => {
  const { handleSubmit, register, setValue, watch } = useForm<FormInput>({
    defaultValues: { title },
  })
  const watchContent = watch('content')
  const maxTextareaHeight = 300
  const contentRef = register('content').ref

  const [createDiscuss] = useCreateDiscussMutation({
    onCompleted(data) {
      if (data.createDiscuss) {
        onCreate(data.createDiscuss)
      }
    },
  })

  const onSubmit = (v: FormInput) => {
    // console.log(v, noteId)
    createDiscuss({
      variables: {
        noteId,
        data: {
          title: v.title,
          content: v.content ?? '',
          //   meta: undefined,
        },
      },
    })
  }

  let textareaTest: HTMLTextAreaElement | null = null

  useLayoutEffect(() => {
    if (textareaTest) {
      // Reset height - important to shrink on delete
      textareaTest.style.height = 'inherit'
      // Set height
      textareaTest.style.height = `${Math.min(
        textareaTest.scrollHeight,
        maxTextareaHeight,
      )}px`
    }
  }, [watchContent])

  return (
    <form
      id="create-discuss-form"
      className="grid auto-rows-min min-w-[40vw] gap-4"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      spellCheck="false"
    >
      <input
        {...register('title', { required: true })}
        className="text-2xl font-bold focus:outline-none"
        type="text"
        placeholder="Title"
        autoFocus
      />
      <textarea
        {...register('content')}
        className={`
              w-full 
              min-h-[18px]
              max-h-${'[' + maxTextareaHeight + ']'}px] 
              resize-none 
              p-2 
              border border-gray-300 
              rounded 
              text-gray-700
              align-top 
              bg-gray-100 
              
              outline-offset-2 
              focus:border-blue-400
              focus:outline-blue-300
            `}
        placeholder="Leave a comment"
        ref={e => {
          contentRef(e)
          textareaTest = e
        }}
      />
    </form>
  )
}

export default CreateDiscussForm
