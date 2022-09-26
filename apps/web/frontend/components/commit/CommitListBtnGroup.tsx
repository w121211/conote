import React from 'react'

interface Props {
  hasPrevious: boolean
  hasNext: boolean
  onClickPrevious: () => void
  onClickNext: () => void
}

const btnGroupClass =
  'py-2 px-4 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-gray-100 text-gray-700 text-sm align-middle hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400'
const btnGroupClass_disabled =
  'py-2 px-4 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-gray-100 text-gray-700 text-sm align-middle dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 cursor-not-allowed'

const CommitListBtnGroup = ({
  hasNext,
  hasPrevious,
  onClickNext,
  onClickPrevious,
}: Props) => {
  return (
    <div className="flex w-full justify-center pt-8">
      <div className="inline-flex rounded-md shadow-sm">
        <button
          type="button"
          className={hasPrevious ? btnGroupClass : btnGroupClass_disabled}
          disabled={!hasPrevious}
          onClick={() => onClickPrevious()}
        >
          Previous
        </button>
        <button
          type="button"
          className={hasNext ? btnGroupClass : btnGroupClass_disabled}
          disabled={!hasNext}
          onClick={() => onClickNext()}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default CommitListBtnGroup
