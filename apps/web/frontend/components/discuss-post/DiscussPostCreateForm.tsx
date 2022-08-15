import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MarkDownParser } from '../discuss/mark-down-parser'
import {
  DiscussPostsDocument,
  useCreateDiscussPostMutation,
} from '../../../apollo/query.graphql'
import './github-markdown-light.module.css'
import LoginRequireModal from '../auth/login-require-modal'
import { useMeContext } from '../auth/use-me-context'
import { FormSubmitBtn } from '../ui/form/form-submit-btn'

interface FormInput {
  content: string
}

const DiscussPostCreateForm = ({
  discussId,
  isModal,
  onSubmitted,
}: {
  discussId: string
  isModal?: boolean
  onSubmitted?: () => void
}) => {
  const { me } = useMeContext()
  const [createPost, { loading: isLoading }] = useCreateDiscussPostMutation({
    refetchQueries: [{ query: DiscussPostsDocument, variables: { discussId } }],
    onCompleted(data) {
      reset({ content: '' })
      if (submitRef.current) submitRef.current.blur()
      if (onSubmitted) onSubmitted()
    },
  })
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    reset,
    formState: { isDirty, errors },
  } = useForm<FormInput>({
    defaultValues: { content: '' },
  })
  const watchContent = watch('content')
  const contentRef = register('content').ref
  const submitRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [showTextarea, setShowTextarea] = useState(true)
  const maxTextareaHeight = isModal ? 100 : 300

  function onSubmit(d: FormInput) {
    createPost({
      variables: { discussId, data: { content: d.content.trim() } },
    })
  }

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
      className="relative w-full text-sm scroll-mb-10 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      ref={formRef}
    >
      <div className="pt-2 border-x border-t border-gray-300 rounded-t bg-gray-100">
        <div className="relative z-[1] mb-[-1px] ml-2 text-sm " role="tablist">
          <button
            className={`px-4 py-2 border-x border-t rounded-t ${
              showTextarea
                ? 'border-gray-300 text-gray-700 bg-white hover:bg-white'
                : 'border-transparent text-gray-400 bg-transparent hover:text-gray-700'
            }`}
            onClick={() => setShowTextarea(true)}
            role="tab"
            type="button"
          >
            Edit
          </button>
          <button
            className={`px-4 py-2 border-x border-t rounded-t
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
            <LoginRequireModal>
              <textarea
                {...register('content', {
                  required: {
                    value: true,
                    message: 'Content is empty.',
                  },
                  minLength: {
                    value: 30,
                    message: 'Content requires minimum of 30 chars.',
                  },
                  maxLength: {
                    value: 2000,
                    message: 'Content exceeds maximum of 2000 chars.',
                  },
                })}
                className={`w-full ${
                  isModal ? 'min-h-[18px]' : 'min-h-[120px]'
                } max-h-[${maxTextareaHeight}]px] resize-none p-2 border border-gray-300 rounded text-gray-700 align-top bg-gray-100 outline-offset-2 focus:border-blue-400 focus:outline-blue-300`}
                placeholder="Leave a comment"
                ref={e => {
                  contentRef(e)
                  textareaTest = e
                }}
                disabled={me === null}
              />
            </LoginRequireModal>

            {errors.content && (
              <div className="mt-2 text-red-600">
                <span className="material-icons-outlined text-sm mr-1">
                  error_outline
                </span>
                {errors.content.message}
              </div>
            )}
          </div>
        ) : (
          <div
            className={`block ${
              isModal ? 'min-h-[18px]' : 'min-h-[120px]'
            } m-2 p-2 border-b border-gray-300`}
          >
            <MarkDownParser text={getValues('content')} />
          </div>
        )}

        <div className="text-right m-2 mt-4">
          <FormSubmitBtn isDirty={isDirty} isLoading={isLoading}>
            Comment
          </FormSubmitBtn>
        </div>
      </div>
    </form>
  )
}

export default DiscussPostCreateForm
