import moment from 'moment'
import React, { ReactEventHandler, useEffect, useLayoutEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { DiscussPostsDocument, useCreateDiscussPostMutation } from '../../../apollo/query.graphql'

interface FormInput {
  content: string
}

const CreatePostForm = ({ discussId, isModal }: { discussId: string; isModal?: boolean }) => {
  const { register, handleSubmit, setValue, watch, reset, formState } = useForm<FormInput>({
    defaultValues: { content: '' },
  })
  const { isSubmitSuccessful } = formState
  const commentRef = useRef<HTMLDivElement>(null)
  const submitRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [createPost] = useCreateDiscussPostMutation({
    refetchQueries: [{ query: DiscussPostsDocument, variables: { discussId } }],
    onCompleted(data) {
      if (submitRef.current && data.createDiscussPost) {
        reset({ content: '' })
        // commentRef.current.blur()
        submitRef.current.blur()
      }
    },
  })

  useEffect(() => {
    register('content')
  }, [])

  const watchContent = watch('content')

  const onSubmit = (d: FormInput) => {
    createPost({ variables: { discussId, data: { content: d.content.trim() } } })
  }

  const formClassName = isModal ? `sticky group  bottom-0 text-sm bg-white` : `relative bottom-0 text-sm scroll-mb-10 `

  const btnClassName = isModal
    ? `hidden group-focus-within:block focus:block w-full text-right mt-2`
    : `text-right pt-2`

  const maxTextareaHeight = isModal ? 100 : 300
  const contentRef = register('content').ref
  let textareaTest: HTMLTextAreaElement | null = null

  useLayoutEffect(() => {
    // console.log(myRef)
    if (textareaTest) {
      // Reset height - important to shrink on delete
      textareaTest.style.height = isModal ? '44px' : 'inherit'
      //   // Set height
      textareaTest.style.height = `${Math.min(textareaTest.scrollHeight, maxTextareaHeight)}px`
      //
    }
  }, [watchContent])

  return (
    <form className={formClassName} onSubmit={handleSubmit(onSubmit)} autoComplete="off" ref={formRef}>
      {/* <div
        className="absolute  w-full h-10 group-focus-within:h-32 left-0 top-0 flex-grow flex items-center rounded 
          border border-gray-200
        bg-gray-100 "
      /> */}
      <textarea
        {...register('content')}
        className={`w-full ${isModal ? 'min-h-[18px]' : 'min-h-[120px]'} max-h-${
          '[' + maxTextareaHeight + ']'
        }px] resize-none p-3 border border-gray-200 rounded text-gray-700 bg-gray-50 shadow-inner outline-offset-2 focus:outline-blue-300`}
        placeholder="留言..."
        ref={e => {
          contentRef(e)
          textareaTest = e
        }}
      />
      {/* <div
        contentEditable={true}
        ref={commentRef}
        onInput={e => {
          deleteEmptyChild()
          setValue('content', e.currentTarget.innerText ?? '')
        }}
        onBlur={onBlur}
        onFocus={onFocus}
        className={contentClassName}
        // style={formRef.current ? { width: formRef.current.clientWidth } : undefined}
        spellCheck="false"
      /> */}
      <div className={btnClassName}>
        <button
          type="submit"
          className="btn-primary"
          disabled={watchContent.length === 0 || isSubmitSuccessful}
          ref={submitRef}
        >
          送出
        </button>
      </div>
    </form>
  )
}

export default CreatePostForm
