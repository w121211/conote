import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MarkDownParser } from '../discuss/mark-down-parser'
import {
  DiscussPostsDocument,
  DiscussPostsQuery,
  useCreateDiscussPostMutation,
} from '../../apollo/query.graphql'
import './github-markdown-light.module.css'
import LoginModal from '../login-modal'
import { useMeContext } from '../auth/use-me-context'

interface FormInput {
  content: string
}

const DiscussPostForm = ({
  discussId,
  isModal,
  onSubmitted,
}: {
  discussId: string
  isModal?: boolean
  onSubmitted?: () => void
}) => {
  const { me } = useMeContext()
  const [showTextarea, setShowTextarea] = useState(true)
  const { register, handleSubmit, getValues, watch, reset, formState } =
    useForm<FormInput>({
      defaultValues: { content: '' },
    })
  const { isSubmitSuccessful } = formState
  const submitRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [createPost] = useCreateDiscussPostMutation({
    refetchQueries: [{ query: DiscussPostsDocument, variables: { discussId } }],
    onCompleted(data) {
      if (submitRef.current && data.createDiscussPost) {
        reset({ content: '' })
        submitRef.current.blur()
      }
      if (onSubmitted) onSubmitted()
    },
  })

  const onSubmit = (d: FormInput) => {
    createPost({
      variables: { discussId, data: { content: d.content.trim() } },
    })
  }

  const watchContent = watch('content')

  const formClassName = `relative w-full text-sm scroll-mb-10 shadow-sm`

  const btnClassName = isModal
    ? `hidden group-focus-within:block focus:block w-full text-right mt-2`
    : `text-right m-2 mt-4`

  const maxTextareaHeight = isModal ? 100 : 300
  const contentRef = register('content').ref
  let textareaTest: HTMLTextAreaElement | null = null

  useEffect(() => {
    if (textareaTest) {
      /* Reset height - important to shrink on delete */
      textareaTest.style.height = isModal ? '44px' : 'inherit'
      /* set height */
      textareaTest.style.height = `${Math.min(
        textareaTest.scrollHeight,
        maxTextareaHeight,
      )}px`
    }
  }, [watchContent])

  return (
    <form
      className={formClassName}
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      ref={formRef}
    >
      <div className="pt-2 border-x border-t border-gray-300 rounded-t bg-gray-100">
        <div className="relative z-[1] mb-[-1px] ml-2 text-sm " role="tablist">
          <button
            className={`
            px-4 py-2
            border-x border-t
            rounded-t
            ${
              showTextarea
                ? ' border-gray-300 text-gray-700 bg-white hover:bg-white '
                : 'border-transparent text-gray-400 bg-transparent hover:text-gray-700'
            }
            `}
            onClick={() => setShowTextarea(true)}
            role="tab"
            type="button"
          >
            Edit
          </button>
          <button
            className={`
            
            px-4 py-2
            border-x border-t
            rounded-t
            ${
              !showTextarea
                ? ' border-gray-300 text-gray-700 bg-white hover:bg-white '
                : 'border-transparent text-gray-400 bg-transparent hover:text-gray-700'
            }
            `}
            onClick={() => setShowTextarea(false)}
            role="tab"
            type="button"
          >
            Preview
          </button>
        </div>
      </div>
      <div className=" rounded-b border border-gray-300 bg-white ">
        {showTextarea ? (
          <div className="m-2">
            <LoginModal>
              <textarea
                {...register('content')}
                className={`
              w-full 
              ${isModal ? 'min-h-[18px]' : 'min-h-[120px]'} 
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
                disabled={!me}
              />
            </LoginModal>
          </div>
        ) : (
          <div
            className={`
            block 
            ${isModal ? 'min-h-[18px]' : 'min-h-[120px]'} 
            m-2
            p-2
            border-b
            border-gray-300
            `}
          >
            <MarkDownParser text={getValues('content')} />
          </div>
        )}
        <div className={btnClassName}>
          <button
            type="submit"
            className="btn-primary font-medium "
            disabled={watchContent.length === 0 || isSubmitSuccessful}
            ref={submitRef}
          >
            Comment
          </button>
        </div>
      </div>
    </form>
  )
}

export default DiscussPostForm
