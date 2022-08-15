import React from 'react'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import {
  DiscussesLatestDocument,
  DiscussesLatestQuery,
  DiscussesLatestQueryVariables,
  DiscussFragment,
} from '../apollo/query.graphql'
import { getApolloClientSSR } from '../apollo/apollo-client-ssr'
import { LatestDiscussTile } from '../frontend/components/latest-discuss-tile'

type Props = {
  discussesLatest: DiscussFragment[]
}

const HomePage = ({ discussesLatest }: Props) => {
  return (
    <div className="flex justify-center pb-[9vh]">
      <div className="flex-1 flex flex-col items-center md:items-start md:flex-row md:justify-between  gap-6">
        <LatestDiscussTile data={discussesLatest} />
        {/* <UserRateTable data={mockRateData} /> */}
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
