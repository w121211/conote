import React from 'react'
import { useForm } from 'react-hook-form'
import { useIsomorphicLayoutEffect } from 'react-use'
import {
  DiscussFragment,
  useCreateDiscussMutation,
} from '../../../apollo/query.graphql'
import { FormSubmitBtn } from '../ui/form/form-submit-btn'

interface FormInput {
  title: string
  content?: string
}

type Props = {
  // noteId?: string
  noteDraftId: string
  title: string
  onCreate: (data: DiscussFragment) => void
  // onEdit: (data: DiscussFragment) => void
}

/**
 * If `disucss` is given, the form is to edit the discuss. Otherwise, the form is in creation.
 */
const DiscussForm = ({
  // noteId,
  noteDraftId,
  title,
  onCreate,
}: Props) => {
  const [createDiscuss] = useCreateDiscussMutation({
      onCompleted(data) {
        if (data.createDiscuss) {
          onCreate(data.createDiscuss)
        }
      },
    }),
    {
      handleSubmit,
      register,
      formState: { isSubmitting },
      watch,
    } = useForm<FormInput>({
      defaultValues: { title },
    }),
    watchContent = watch('content'),
    contentRef = register('content').ref,
    maxTextareaHeight = 300

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
    createDiscuss({
      variables: {
        noteDraftId,
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
      // id="create-discuss-form"
      className="grid auto-rows-min w-full px-10 py-5 gap-4"
      onSubmit={handleSubmit(onSubmit)}
      // autoComplete="off"
      // spellCheck="false"
    >
      <div className="relative before:content-['#'] before:absolute before:-translate-x-full before:-ml-1 before:pt-2 before:text-gray-400 before:font-medium before:text-xl">
        <textarea
          {...register('title', { required: true })}
          className="input w-full text-gray-800 text-xl font-medium resize-none "
          placeholder="Title"
          autoFocus
          disabled={isSubmitting}
        />
      </div>
      <textarea
        {...register('content')}
        className={`
              input
              w-full 
              min-h-[18px]
              max-h-${'[' + maxTextareaHeight + ']'}px] 
              resize-none 
              align-top 
              bg-gray-100 
              hover:bg-gray-100
             
            `}
        placeholder="Add information to your question (optional)."
        ref={e => {
          contentRef(e)
          textareaTest = e
        }}
        disabled={isSubmitting}
      />
      <div className=" text-center">
        <FormSubmitBtn size="lg">Create the discuss</FormSubmitBtn>
        {/* <button
          // form="create-discuss-form"
          className={`btn-primary-lg `}
          type="submit"
        >
          Create the discuss
        </button> */}
      </div>
    </form>
  )
}

export default DiscussForm
