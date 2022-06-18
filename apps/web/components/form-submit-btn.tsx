import React, { ReactNode } from 'react'
import { LoadingSvg } from './loading-circle'

interface Props {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  onSubmit?: () => void
  isLoading?: boolean
  isSubmitSucessful?: boolean
}

export const FormSubmitBtn = ({
  children,
  size = 'sm',
  onSubmit,
  isLoading,
}: Props): JSX.Element => {
  return (
    <button
      className={`${
        size === 'sm'
          ? 'btn-primary'
          : size === 'md'
          ? 'btn-primary-md'
          : 'btn-primary-lg'
      }
      ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
      type="submit"
      onClick={e => {
        if (isLoading) {
          e.preventDefault()
        } else {
          onSubmit
        }
      }}
    >
      <div className="flex">
        {isLoading && <LoadingSvg svgClassName="w-5 h-5 mr-2 !text-white" />}
        {isLoading ? 'Processing...' : children}
      </div>
    </button>
  )
}
