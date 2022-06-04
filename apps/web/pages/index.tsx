import React, { useEffect, useState } from 'react'
import { SearchAllForm } from '../components/search-all-form'
import NewHotList from '../components/_new-hot-list'
import UserRateTable from '../components/user/user-rate-table'
import { mockRateData } from './user/[userid]'
import AuthItem from '../components/auth/auth-Item'
import { useMe } from '../components/auth/use-me'
import HotDisplay from '../components/hot-display/hot-display'

const HomePage = (): JSX.Element => {
  const [showAnnounce, setAnnounce] = useState(false)
  const { me, loading } = useMe()

  useEffect(() => {
    if (window.sessionStorage.getItem('announce') === null) {
      window.sessionStorage.setItem('announce', 'true')
      setAnnounce(true)
    } else {
      window.sessionStorage.setItem('announce', showAnnounce ? 'true' : 'false')
    }
  }, [showAnnounce])
  // const { data, loading } = useMeQuery()

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen">
        <svg
          className="origin-center animate-loadingSpinner"
          width="100"
          height="100"
        >
          <circle
            className="stroke-blue-500 origin-center [stroke-dasharray:187] [stroke-dashoffset:0] animate-loadingCircle"
            cx="50"
            cy="50"
            r="25"
            fill="none"
            strokeWidth={5}
            strokeLinecap="round"
          />
        </svg>
        {/* <h1>Loading</h1> */}
      </div>
    )
  return (
    <div className="flex flex-col w-screen h-screen overflow-auto">
      {showAnnounce && (
        <div className="sticky top-0 w-screen z-10 flex items-center justify-between p-1 capitalize text-sm text-gray-900 bg-yellow-400 text-center">
          <div className="flex-grow flex items-center justify-center  gap-2 ">
            <span className="material-icons">campaign</span>
            <span className="truncate">new announcement!</span>
          </div>
          <span
            className="material-icons relative inline-block items-center right-0 text-base 
        hover:cursor-pointer hover:text-gray-600"
            onClick={() => {
              setAnnounce(false)
            }}
          >
            close
          </span>
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex items-center justify-between   border-slate-200 px-4 md:px-10 pt-6 pb-6 ">
          <div className="flex-3 flex items-center max-w-2xl">
            <h2 className="my-0 mr-4 md:mr-10 ">Konote</h2>
            <div className="w-5/6">
              <SearchAllForm />
            </div>
          </div>
          {/* <AuthItem me={me} /> */}
        </div>
        <>
          <div className=" flex pb-[9vh] pt-6 bg-gray-100">
            <div className="flex flex-col items-center md:items-start md:flex-row ms:justify-between  md:w-3/4 md:ml-[calc(4rem+96px)] gap-6">
              <HotDisplay />
              <UserRateTable data={mockRateData} />
            </div>
          </div>
        </>
      </div>
    </div>
  )
}

export default HomePage
