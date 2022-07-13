import React from 'react'
import { SearcherProps, searcherRepo } from '../../stores/searcher.repository'

const SearcherModalButton = ({ searcher }: Pick<SearcherProps, 'searcher'>) => {
  return (
    <button
      className="
          flex items-center 
          w-full
          p-1
          border-gray-200 dark:border-gray-500
          rounded
          bg-gray-200/60
          hover:bg-gray-200
          transition-['background-color']
          duration-200
          text-sm
          capitalize"
      onClick={() => {
        searcherRepo.setSearcher(searcher)
        searcherRepo.setShowModal(true)
      }}
    >
      <span className="material-icons mr-1 text-xl text-gray-400 leading-none">
        search
      </span>
      <div className="flex-1 flex">
        <span className="flex-grow mr-10 text-left text-gray-400">search</span>
        {/* <span className="text-gray-500 dark:text-gray-300">
            <kbd className="inline-flex justify-center min-w-[20px] mr-[2px] px-1 py-[2px] rounded-sm bg-gray-300/70 dark:bg-gray-600 font-sans text-xs leading-none">
              {keyPrefix}
            </kbd>
            <kbd className="inline-flex justify-center min-w-[20px] mr-[2px] px-1 py-[2px] rounded-sm bg-gray-300/70 dark:bg-gray-600 font-sans text-xs leading-none">
              K
            </kbd>
          </span> */}
      </div>
    </button>
  )
}

export default SearcherModalButton
