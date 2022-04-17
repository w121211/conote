import moment from 'moment'
import React, { ReactEventHandler, useEffect, useLayoutEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useForm } from 'react-hook-form'
import { DiscussPostsDocument, useCreateDiscussPostMutation } from '../../../apollo/query.graphql'
// import 'github-markdown-css/github-markdown-light.css'
// import SyntaxHighlighter from 'react-syntax-highlighter'
import './github-markdown-light.css'

interface FormInput {
  content: string
}

export const CreatePostForm = ({ discussId, isModal }: { discussId: string; isModal?: boolean }) => {
  const [showTextarea, setShowTextarea] = useState(true)
  const [preview, setPreview] = useState('')
  const { register, handleSubmit, getValues, watch, reset, formState } = useForm<FormInput>({
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

  const formClassName = isModal
    ? `sticky group bg-white bottom-0 text-sm `
    : `relative bottom-0 text-sm scroll-mb-10 shadow-sm`

  const btnClassName = isModal
    ? `hidden group-focus-within:block focus:block w-full text-right mt-2`
    : `text-right m-2 mt-4`

  const maxTextareaHeight = isModal ? 100 : 300
  const contentRef = register('content').ref
  let textareaTest: HTMLTextAreaElement | null = null

  useLayoutEffect(() => {
    console.log(watchContent)
    if (textareaTest) {
      // Reset height - important to shrink on delete
      textareaTest.style.height = isModal ? '44px' : 'inherit'
      //   // Set height
      textareaTest.style.height = `${Math.min(textareaTest.scrollHeight, maxTextareaHeight)}px`
      //
    }
    // const converMd=async () => {
    //   await octokit.
    // }
  }, [watchContent])

  console.log(watchContent.length === 0, isSubmitSuccessful)

  return (
    <form className={formClassName} onSubmit={handleSubmit(onSubmit)} autoComplete="off" ref={formRef}>
      {/* <div
        className="absolute  w-full h-10 group-focus-within:h-32 left-0 top-0 flex-grow flex items-center rounded 
          border border-gray-200
        bg-gray-100 "
      /> */}
      <div className="pt-2 border-x border-t border-gray-300 rounded-t bg-gray-100">
        <div className="relative z-[1] mb-[-1px] ml-2 text-sm " role="tablist">
          <button
            className={`
            btn-reset-style
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
            編輯
          </button>
          <button
            className={`
            btn-reset-style
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
            預覽
          </button>
        </div>
      </div>
      <div className=" rounded-b border border-gray-300 bg-white ">
        {showTextarea ? (
          <div className="m-2">
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
              placeholder="留言..."
              ref={e => {
                contentRef(e)
                textareaTest = e
              }}
            />
          </div>
        ) : (
          <div
            className={`
            block 
            ${isModal ? 'min-h-[18px]' : 'min-h-[120px]'} 
            rounded
            m-2
            p-2
            border-b
            border-gray-300
            
              `}
          >
            <ReactMarkdown
              className="markdown-body "
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter language={match[1]} style={prism} {...props}>
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                  // return !inline && match ? (
                  //   <code className={className} {...props}>
                  //     {children}
                  //   </code>
                  // ) : (
                  //   // <SyntaxHighlighter language={match[1]} style={githubGist} PreTag="div" {...props}>
                  //   //   {String(children).replace(/\n$/, '')}
                  //   // </SyntaxHighlighter>
                  //   <code className={className} {...props}>
                  //     {children}
                  //   </code>
                  // )
                },
              }}
            >
              {getValues('content')}
            </ReactMarkdown>
          </div>
        )}
        <div className={btnClassName}>
          <button
            type="submit"
            className="btn-primary font-medium "
            disabled={watchContent.length === 0 || isSubmitSuccessful}
            ref={submitRef}
          >
            留言
          </button>
        </div>
      </div>
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
    </form>
  )
}
