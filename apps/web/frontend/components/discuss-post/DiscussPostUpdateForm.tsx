import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  DiscussPostFragment,
  UpdateDiscussPostMutation,
  useUpdateDiscussPostMutation,
} from '../../../apollo/query.graphql'
import './github-markdown-light.module.css'
import { useMeContext } from '../auth/use-me-context'
import { FormSubmitBtn } from '../ui/form/form-submit-btn'

type FormInput = {
  content: string
}

type Props = {
  post: DiscussPostFragment
  onClickCancel: () => void
  onSubmitCompleted: (d: UpdateDiscussPostMutation) => void
}

const DiscussPostUpdateForm = ({
  post,
  onClickCancel,
  onSubmitCompleted,
}: Props) => {
  const { me } = useMeContext()
  const [updatePost, { loading: isLoading }] = useUpdateDiscussPostMutation({
    // refetchQueries: [{ query: DiscussPostsDocument, variables: { discussId } }],
    onCompleted(data) {
      reset({ content: '' })
      if (submitRef.current) submitRef.current.blur()
      if (onSubmitCompleted) onSubmitCompleted(data)
    },
  })
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty, errors },
  } = useForm<FormInput>({
    defaultValues: { content: post.content },
  })
  const watchContent = watch('content')
  const contentRef = register('content').ref
  const submitRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const maxTextareaHeight = 300

  function onSubmit(form: FormInput) {
    updatePost({
      variables: { id: post.id, data: { content: form.content.trim() } },
    })
  }

  let textareaTest: HTMLTextAreaElement | null = null

  useEffect(() => {
    if (textareaTest) {
      /* Reset height - important to shrink on delete */
      // textareaTest.style.height = isModal ? '44px' : 'inherit'
      textareaTest.style.height = 'inherit'
      /* set height */
      textareaTest.style.height = `${Math.min(
        textareaTest.scrollHeight,
        maxTextareaHeight,
      )}px`
    }
  }, [watchContent])

  return (
    <form
      className="relative w-full text-sm mb-2"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      ref={formRef}
    >
      <div className="my-2">
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
            // isModal ? 'min-h-[18px]' : 'min-h-[120px]'
            'min-h-[120px]'
          } max-h-[${maxTextareaHeight}]px] resize-none p-2 border border-gray-300 rounded text-gray-700 align-top bg-gray-100 outline-offset-2 focus:border-blue-400 focus:outline-blue-300`}
          placeholder="Leave a comment"
          ref={e => {
            contentRef(e)
            textareaTest = e
          }}
          aria-invalid={errors.content ? 'true' : 'false'}
          disabled={me === null}
        />

        {errors.content && (
          <div className="mt-2 text-red-600">
            <span className="material-icons-outlined text-sm mr-1">
              error_outline
            </span>
            {errors.content.message}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <FormSubmitBtn isDirty={isDirty} isLoading={isLoading}>
          Update
        </FormSubmitBtn>
        <button className="btn-normal-md" onClick={() => onClickCancel()}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default DiscussPostUpdateForm
