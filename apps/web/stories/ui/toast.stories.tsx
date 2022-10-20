import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useEffect } from 'react'
import { Id, toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default {
  component: ToastContainer,
} as ComponentMeta<typeof ToastContainer>

export const Info = () => {
  const toastIdRef = React.useRef<Id | null>(null)

  function onClickUndo() {
    if (toastIdRef.current !== null) {
      toast.dismiss(toastIdRef.current)
    }
  }

  useEffect(() => {
    toastIdRef.current = toast.info(
      <div className="flex">
        <p className="flex-1 py-2">Template set.</p>
        <button className="btn-ghost-blue" onClick={onClickUndo}>
          Undo
        </button>
      </div>,
    )
  })

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        closeOnClick={false}
        draggable={false}
        // hideProgressBar
      />
    </>
  )
}
