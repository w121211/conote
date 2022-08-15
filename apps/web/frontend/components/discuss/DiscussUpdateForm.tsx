import React from 'react'
import { useForm } from 'react-hook-form'
import { useIsomorphicLayoutEffect } from 'react-use'
import {
  DiscussFragment,
  UpdateDiscussMutation,
  useUpdateDiscussMutation,
} from '../../../apollo/query.graphql'
import { FormSubmitBtn } from '../ui/form/form-submit-btn'

interface FormInput {
  title: string
  content?: string
}

type Props = {
  discuss: DiscussFragment
  onClickCancel: () => void
  onSubmitCompleted: (d: UpdateDiscussMutation) => void
}

const DiscussUpdateForm = ({
  discuss,
  onClickCancel,
  onSubmitCompleted,
}: Props) => {
  const { id, title, content } = discuss
  const [updateDiscuss, { loading: isLoading }] = useUpdateDiscussMutation({
    onCompleted(data) {
      onSubmitCompleted(data)
    },
  })
  const { handleSubmit, register, formState, watch } = useForm<FormInput>({
    defaultValues: { title, content: content ?? undefined },
  })
  const watchContent = watch('content'),
    contentRef = register('content').ref
  const maxTextareaHeight = 300

  let textareaTest: HTMLTextAreaElement | null = null

  useIsomorphicLayoutEffect(() => {
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

  function onSubmit(v: FormInput) {
    updateDiscuss({
      variables: {
        id: discuss.id,
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
      className="grid auto-rows-min w-full px-10 py-5 gap-4"
      onSubmit={handleSubmit(onSubmit)}
      // autoComplete="off"
      // spellCheck="false"
    >
      <div className="relative before:content-['#'] before:absolute before:-translate-x-full before:-ml-1 before:pt-2 before:text-gray-400 before:font-medium before:text-xl">
        <input
          {...register('title', { required: true, maxLength: 144 })}
          className="input w-full text-lg resize-none"
          placeholder="Title"
          autoFocus
          disabled={formState.isSubmitting}
        />
      </div>

      <textarea
        {...register('content', { maxLength: 600 })}
        className={`input w-full min-h-[18px] max-h-[${maxTextareaHeight}px] resize-none hover:bg-gray-100`}
        placeholder="Add information to your question (optional)."
        ref={e => {
          contentRef(e)
          textareaTest = e
        }}
        rows={4}
        disabled={formState.isSubmitting}
      />

      <div className="flex justify-end space-x-3">
        <FormSubmitBtn isDirty={formState.isDirty} isLoading={isLoading}>
          Submit
        </FormSubmitBtn>
        <button className="btn-normal-md" onClick={() => onClickCancel()}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default DiscussUpdateForm
