import moment from 'moment'
import React, { ReactEventHandler, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { DiscussPostsDocument, useCreateDiscussPostMutation } from '../../apollo/query.graphql'

interface FormInput {
  content: string
}

const ModalCreatePostForm = ({ discussId, type }: { discussId: string; type: 'modal' | 'page' }) => {
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
      if (commentRef.current && submitRef.current && data.createDiscussPost) {
        commentRef.current.innerText = ''
        reset({ content: '' })
        commentRef.current.blur()
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

  const deleteEmptyChild = () => {
    if (
      commentRef.current &&
      (commentRef.current.innerHTML === '<br>' || commentRef.current?.innerHTML === '<div><br></div>')
    ) {
      commentRef.current.innerHTML = ''
    }
  }

  const formClassName =
    type === 'modal'
      ? `sticky group gap-2 bottom-0 text-sm bg-white pb-1`
      : `relative gap-2 bottom-0 text-sm scroll-mb-10`

  const contentClassName =
    type === 'modal'
      ? `relative box-content h-5 px-2 py-2 rounded overflow-y-auto 
      !shadow-[0_0_0_1px_rgb(229,229,229)] bg-gray-100 outline-none 
      focus:h-28 group-focus-within:h-28 focus:outline-none focus-visible:outline-none 
      empty:before:content-['留言...'] before:text-gray-400 transition-all focus:whitespace-pre-line 
      [word-break:break-word] truncate `
      : `relative w-full px-2 py-2 rounded  outline-none min-h-[7rem] max-h-72 overflow-y-auto 
      bg-gray-100 focus:outline-none focus-visible:outline-none empty:before:content-['留言...'] 
      before:text-gray-400 break-words`

  const btnClassName =
    type === 'modal' ? `hidden group-focus-within:block focus:block w-full text-right pt-2` : `text-right pt-2`

  const onFocus = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    if (type === 'modal' && commentRef.current) {
      commentRef.current.querySelectorAll('div').forEach(el => {
        el.style.opacity = '1'
      })
    }
  }

  const onBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    if (type === 'modal' && commentRef.current) {
      commentRef.current.querySelectorAll('div').forEach(el => {
        el.style.opacity = '0'
      })
    }
  }

  return (
    <form className={formClassName} onSubmit={handleSubmit(onSubmit)} autoComplete="off" ref={formRef}>
      {/* <div
        className="absolute  w-full h-10 group-focus-within:h-32 left-0 top-0 flex-grow flex items-center rounded 
          border border-gray-200
        bg-gray-100 "
      /> */}
      <div
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
      />
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

export default ModalCreatePostForm
