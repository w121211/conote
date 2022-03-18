import React, { useState } from 'react'
import ToggleMenu from '../../../layout/toggle-menu'

const PostOptionsMenu = ({ myPost }: { myPost: boolean }) => {
  return (
    <ToggleMenu
      className="flex flex-col justify-center w-20 left-full -translate-x-full py-1 text-gray-600"
      summary={
        <span className="material-icons-outlined p-1 rounded text-base leading-none hover:bg-gray-100 hover:text-gray-700">
          more_horiz
        </span>
      }
    >
      <>
        {myPost && (
          <button className="btn-reset-style w-full py-1 text-xs hover:bg-gray-100 ">
            <span className="material-icons-outlined mr-[2px] text-base leading-none">edit</span>
            <p className="flex-shrink-0 ">編輯</p>
          </button>
        )}
        {!myPost && (
          <button className="btn-reset-style w-full py-1 text-xs hover:bg-gray-100 ">
            <span className="material-icons-outlined mr-[2px] text-base leading-none">flag</span>
            <p className="flex-shrink-0 ">檢舉</p>
          </button>
        )}
        {myPost && (
          <button className="btn-reset-style w-full py-1 text-xs text-red-500 hover:bg-gray-100 ">
            <span className="material-icons-outlined mr-[2px] text-base leading-none">delete</span>
            <p className="flex-shrink-0 ">刪除</p>
          </button>
        )}
      </>
    </ToggleMenu>
    // <details className="group relative h-fit cursor-pointer select-none " open={false}>
    //   <summary
    //     className={`inline-block h-6 p-1 rounded list-none leading-none text-gray-500 hover:text-gray-700 hover:bg-gray-100
    //      before:content-[''] ${
    //        open ? 'before:fixed' : 'before:hidden'
    //      } before:w-screen before:h-screen  before:top-0 before:left-0 before:right-0 before:bottom-0 before:z-50 before:cursor-default`}
    //     onClick={() => setOpen(o => !o)}
    //   >
    //     <span className="material-icons-outlined text-base leading-none ">more_horiz</span>
    //   </summary>
    //   <div
    //     className="absolute flex flex-col justify-center w-20 top-full left-full -translate-x-full py-1
    //  border border-gray-200 rounded bg-white shadow-lg text-gray-600 z-50
    //   opacity-0 scale-75 transition-all ease-[cubic-bezier(0.21,0.02,0.28,1.58)]  group-open:opacity-100 group-open:scale-100"
    //   >

    //   </div>
    // </details>
  )
}

export default PostOptionsMenu
