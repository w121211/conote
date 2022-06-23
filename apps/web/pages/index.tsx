import React, { useEffect, useState } from 'react'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { SearchAllForm } from '../components/search-all-form'
import {
  DiscussesLatestDocument,
  DiscussesLatestQuery,
  DiscussesLatestQueryVariables,
  DiscussFragment,
} from '../apollo/query.graphql'
import { getApolloClientSSR } from '../apollo/apollo-client-ssr'
import { LatestDiscussTile } from '../components/latest-discuss-tile'
import AuthItem from '../components/auth/auth-el'
import { LayoutChildrenPadding } from '../components/ui-component/layout/layout-children-padding'

interface Props {
  discussesLatest: DiscussFragment[]
  // noteDocEntriesToMerge: NoteDocEntryFragment[]
  // noteDocEntriesMerged: NoteDocEntryFragment[]
}

const HomePage = ({ discussesLatest }: Props): JSX.Element => {
  // useEffect(() => {
  //   if (window.sessionStorage.getItem('announce') === null) {
  //     window.sessionStorage.setItem('announce', 'true')
  //     setAnnounce(true)
  //   } else {
  //     window.sessionStorage.setItem('announce', showAnnounce ? 'true' : 'false')
  //   }
  // }, [showAnnounce])

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
    <LayoutChildrenPadding>
      <div className="flex justify-center pb-[9vh]">
        <div className="flex-1 flex flex-col items-center md:items-start md:flex-row md:justify-between  gap-6">
          <LatestDiscussTile data={discussesLatest} />
          {/* <UserRateTable data={mockRateData} /> */}
        </div>
      </div>
    </LayoutChildrenPadding>
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
