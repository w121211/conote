import React from 'react'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import {
  CommitsLatestDocument,
  CommitsLatestQuery,
  CommitsLatestQueryVariables,
  DiscussesLatestDocument,
  DiscussesLatestQuery,
  DiscussesLatestQueryVariables,
  NoteDocFragment,
  NoteDocsLatestDocument,
  NoteDocsLatestQuery,
  NoteDocsLatestQueryVariables,
} from '../apollo/query.graphql'
import { getApolloClientSSR } from '../apollo/apollo-client-ssr'
import DiscussList from '../frontend/components/discuss/DiscussList'
import SymbolDecorate, {
  styleSymbol,
} from '../frontend/components/symbol/SymbolDecorate'
import { parseSymbol } from '../share/symbol.common'
import { AppPageProps } from '../frontend/interfaces'
import Link from 'next/link'
import { getNotePageURL } from '../frontend/utils'
import NoteDocList from '../frontend/components/note/NoteDocList'
import CommitList from '../frontend/components/commit/CommitList'
import CommitListLatest from '../frontend/components/commit/CommitListLatest'

function deduplicateNoteDocs(noteDocs: NoteDocFragment[]): NoteDocFragment[] {
  // const deduplicates: NoteDocFragment[] = []
  const symbolSet: Set<string> = new Set()
  const deduplicats: NoteDocFragment[] = []

  for (const e of noteDocs) {
    const { symbol } = e
    if (!symbolSet.has(symbol)) {
      symbolSet.add(symbol)
      deduplicats.push(e)
    }
  }

  return deduplicats
}

// const NoteDocList = ({ noteDocs }: { noteDocs: NoteDocFragment[] }) => (
//   <ul className="max-w-xs flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
//     {noteDocs.map(({ id, contentHead, symbol }) => {
//       const symbolParsed = parseSymbol(symbol)
//       const urlTitle =
//         symbolParsed.url && contentHead.title ? contentHead.title : null
//       const { bracketLeftSpan, bracketRightSpan, symbolSpan, urlTitleSpan } =
//         styleSymbol(symbolParsed, urlTitle)
//       return (
//         <li
//           key={id}
//           className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium text-gray-800 dark:text-white"
//         >
//           <span className="material-icons-outlined text-xl leading-none text-gray-400">
//             description
//           </span>
//           <Link href={getNotePageURL(symbol, id)}>
//             <a className="text-base font-base text-blue-600 dark:text-white hover:underline">
//               <SymbolDecorate
//                 symbol={symbol}
//                 title={contentHead.title}
//                 id={id}
//               />
//             </a>
//           </Link>
//           {/* <span>
//             {bracketLeftSpan}
//             {symbolSpan}
//             {bracketRightSpan}
//             {urlTitleSpan}
//           </span> */}
//           {/* <span className="text-xs text-gray-600">Merge poll open</span> */}
//           {/* <span className="inline-flex items-center py-1 px-2 rounded-full text-xs font-medium bg-blue-500 text-white">
//                   Merge poll
//                 </span> */}
//         </li>
//       )
//     })}
//   </ul>
// )

interface Props extends AppPageProps {
  discussesLatestResult: DiscussesLatestQuery
  // noteDocsLatestResult: NoteDocsLatestQuery
  commitsLatestResult: CommitsLatestQuery
}

const HomePage = ({
  discussesLatestResult: {
    discussesLatest: { discusses },
  },
  // noteDocsLatestResult: { noteDocsLatest },
  commitsLatestResult: { commitsLatest },
}: Props) => {
  return (
    <div className="max-w-2xl flex flex-col pb-12">
      <div className="dark:bg-gray-800 dark:bowrder-gray-700 pb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="leading-none">New Questions</h2>
        </div>
        <DiscussList discusses={discusses} />
      </div>
      <div className="dark:bg-gray-800 dark:bowrder-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="leading-none">New Commits</h2>
        </div>
        {/* <NoteDocList noteDocs={deduplicateNoteDocs(noteDocsLatest)} /> */}
        <CommitListLatest />
      </div>
      {/* <div className="text-sm text-gray-600">
        Incoming notes
        <br />
        {deduplicateNoteDocs(noteDocsLatest).map(e => (
          <span key={e.id} className="mr-2">
            {e.symbol}
          </span>
        ))}
        just joined!
      </div> */}
    </div>
  )

  // return (
  //   <div className="flex justify-center pb-[9vh]">
  //     <div className="flex-1 flex flex-col items-center md:items-start md:flex-row md:justify-between gap-6">
  //     <div className="flex-1 flex flex-col items-start md:justify-between gap-6">
  //       <DiscussList discusses={discusses} />
  //     </div>
  //     <UserRateTable data={mockRateData} />
  //     </div>
  //   </div>
  // )
}

export async function getServerSideProps({
  res,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  const client = getApolloClientSSR()

  const [discussesLatest, commitsLatest] = await Promise.all([
    client.query<DiscussesLatestQuery, DiscussesLatestQueryVariables>({
      query: DiscussesLatestDocument,
    }),
    // client.query<NoteDocsLatestQuery, NoteDocsLatestQueryVariables>({
    //   query: NoteDocsLatestDocument,
    // }),
    client.query<CommitsLatestQuery, CommitsLatestQueryVariables>({
      query: CommitsLatestDocument,
    }),
  ])

  // Caching, see https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props#caching-with-server-side-rendering-ssr
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=200, stale-while-revalidate=259',
  )

  return {
    props: {
      protected: true,
      discussesLatestResult: discussesLatest.data,
      // noteDocsLatestResult: noteDocsLatest.data,
      commitsLatestResult: commitsLatest.data,
    },
  }
}

export default HomePage
