import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default {
  component: ToastContainer,
} as ComponentMeta<typeof ToastContainer>

export const Info = () => {
  toast.info(
    <div className="flex">
      <p className="flex-1 py-2">Template set.</p>
      <button className="btn-ghost-blue">Undo</button>
    </div>,
    {
      // role: 'button',
      // closeOnClick: false,
      // onClick: () => editorValueReset(docUid),
      closeButton: false,
    },
  )
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar
        closeOnClick
        draggable={false}
      />
    </>
  )
}
