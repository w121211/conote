import React, { useEffect, useState } from 'react'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { SearchAllForm } from '../components/search-all-form'
import AuthItem from '../components/auth/auth-item'
import {
  DiscussesLatestDocument,
  DiscussesLatestQuery,
  DiscussesLatestQueryVariables,
  DiscussFragment,
} from '../apollo/query.graphql'
import { getApolloClientSSR } from '../apollo/apollo-client-ssr'
import HotDisplay from '../components/hot-display/hot-display'

interface Props {
  discussesLatest: DiscussFragment[]
  // noteDocEntriesToMerge: NoteDocEntryFragment[]
  // noteDocEntriesMerged: NoteDocEntryFragment[]
}

const HomePage = ({ discussesLatest }: Props): JSX.Element => {
  const [showAnnounce, setAnnounce] = useState(false)

  useEffect(() => {
    if (window.sessionStorage.getItem('announce') === null) {
      window.sessionStorage.setItem('announce', 'true')
      setAnnounce(true)
    } else {
      window.sessionStorage.setItem('announce', showAnnounce ? 'true' : 'false')
    }
  }, [showAnnounce])

  // if (loading)
  //   return (
  //     <div className="flex flex-col items-center justify-center w-screen h-screen">
  //       <svg
  //         className="origin-center animate-loadingSpinner"
  //         width="100"
  //         height="100"
  //       >
  //         <circle
  //           className="stroke-blue-500 origin-center [stroke-dasharray:187] [stroke-dashoffset:0] animate-loadingCircle"
  //           cx="50"
  //           cy="50"
  //           r="25"
  //           fill="none"
  //           strokeWidth={5}
  //           strokeLinecap="round"
  //         />
  //       </svg>
  //       {/* <h1>Loading</h1> */}
  //     </div>
  //   )

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
          <AuthItem />
        </div>
        <>
          <div className=" flex pb-[9vh] pt-6 bg-gray-100">
            <div className="flex flex-col items-center md:items-start md:flex-row ms:justify-between  md:w-3/4 md:ml-[calc(4rem+96px)] gap-6">
              <HotDisplay />
              {/* <UserRateTable data={mockRateData} /> */}
            </div>
          </div>
        </>
      </div>
    </div>
  )
}

export async function getServerSideProps({
  res,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  const client = getApolloClientSSR(),
    { data } = await client.query<
      DiscussesLatestQuery,
      DiscussesLatestQueryVariables
    >({ query: DiscussesLatestDocument })

  // Caching, see https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props#caching-with-server-side-rendering-ssr
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=200, stale-while-revalidate=259',
  )

  return {
    props: {
      discussesLatest: data.discussesLatest,
    },
  }
}

export default HomePage
