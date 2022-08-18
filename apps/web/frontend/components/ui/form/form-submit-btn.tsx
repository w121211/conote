import React from 'react'
import Spinner from '../Spinner'

const btnClass = {
  sm: 'btn-primary',
  md: 'btn-primary-md',
  lg: 'btn-primary-lg',
}

type Props = {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  isDirty: boolean
  isDisabled?: boolean
  isLoading?: boolean
  onClickSubmit?: () => void
}

export const FormSubmitBtn = ({
  children,
  size = 'md',
  isDirty,
  isDisabled,
  isLoading,
  onClickSubmit,
}: Props): JSX.Element => (
  <button
    className={`w-fit ${btnClass[size]} ${
      isLoading ? 'cursor-not-allowed' : 'cursor-pointer'
    }`}
    type="submit"
    onClick={e => {
      if (isLoading) {
        e.preventDefault()
      } else {
        onClickSubmit
      }
    }}
    disabled={isDisabled || !isDirty}
  >
    <div className="flex">
      {children}
      {isLoading && (
        // <Spinner svgClassName="w-5 h-5 ml-2 !text-white" />
        <Spinner />
      )}
    </div>
  </button>
)
