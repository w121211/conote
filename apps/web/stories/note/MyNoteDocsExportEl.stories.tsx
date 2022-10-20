import { ComponentMeta } from '@storybook/react'
import React from 'react'
import { toast, ToastContainer } from 'react-toastify'
import MyNoteDocsExportEl from '../../frontend/components/note/MyNoteDocsExportEl'

export default {
  component: MyNoteDocsExportEl,
} as ComponentMeta<typeof MyNoteDocsExportEl>

export const Base = () => {
  return (
    <div>
      <ToastContainer position="top-center" />
      <button
        onClick={() => {
          toast.info(
            <p>
              Export success.{' '}
              <a className="link" href="/">
                Download file
              </a>
            </p>,
            { autoClose: 6000, hideProgressBar: false },
          )
        }}
      >
        toast
      </button>
    </div>
  )
}
