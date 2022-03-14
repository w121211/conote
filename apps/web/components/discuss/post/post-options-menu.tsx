import React from 'react'

const PostOptionsMenu = () => {
  return (
    <details>
      <summary className=" p-1 rounded list-none text-gray-500 hover:text-gray-700 hover:bg-gray-100">
        <span className="material-icons-outlined text-xl leading-none ">more_horiz</span>
      </summary>
      <button>
        <span className="material-icons-outlined">flag</span>
        <span>檢舉</span>
      </button>
    </details>
  )
}

export default PostOptionsMenu
