import React from 'react'

// const LoadingIcon = ({ svgClassName }: { svgClassName?: string }) => (
//   <div className="flex items-center justify-center ">
//     <svg
//       className={`animate-spin text-gray-400 ${
//         svgClassName ? svgClassName : ''
//       }`}
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//     >
//       <circle
//         className="opacity-25"
//         cx="12"
//         cy="12"
//         r="10"
//         stroke="currentColor"
//         strokeWidth="4"
//       ></circle>
//       <path
//         className="opacity-75"
//         fill="currentColor"
//         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//       ></path>
//     </svg>
//   </div>
// )

type Props = {
  size?: '4' | '6'
  color?: 'gray' | 'blue'
}

const Spinner = ({ size = '4', color = 'gray' }: Props) => (
  <div
    className={`animate-spin inline-block w-${size} h-${size} border-[3px] border-current border-t-transparent text-${color}-600 rounded-full`}
    role="status"
    aria-label="loading"
  >
    <span className="sr-only">Loading...</span>
  </div>
)

export default Spinner
