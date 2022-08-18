import React from 'react'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import {
  DiscussesByUserDocument,
  DiscussesByUserQuery,
  DiscussesByUserQueryVariables,
  DiscussFragment,
  NoteDocFragment,
  NoteDocsByUserDocument,
  NoteDocsByUserQuery,
  NoteDocsByUserQueryVariables,
} from '../../apollo/query.graphql'
import { getApolloClientSSR } from '../../apollo/apollo-client-ssr'
import { getNotePageURL, shortenUserId } from '../../frontend/utils'
import { useMeContext } from '../../frontend/components/auth/use-me-context'
import Link from 'next/link'
import SymbolDecorate from '../../frontend/components/symbol/SymbolDecorate'
import moment from 'moment'
import CardList from '../../frontend/components/ui/CardList'

interface Props {
  userId: string
  noteDocsByUser: NoteDocFragment[]
  discussesByUser: DiscussFragment[]
}

const UserPage = ({
  userId,
  noteDocsByUser,
  discussesByUser,
}: Props): JSX.Element | null => {
  const { me } = useMeContext()
  // console.log(noteDocsByUser, discussesByUser)
  // const [showMentionedPopup, setShowMentionedPopup] = useState(false)
  // if (!data === undefined || error || loading) {
  //   return null
  // }

  return (
    <>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col">
          {/* <span className="material-icons mr-2 leading-none text-xl text-gray-300 dark:text-gray-400">
            account_circle
          </span> */}

          <div className="truncate">
            <h1 className="text-4xl">
              {shortenUserId(userId, me)}
              <span className="pl-3 text-gray-500 font-light">Anonymous</span>
            </h1>
            {/* <div className="mb-2 text-lg text-gray-500 dark:text-gray-400">
              Architect
              </div>
              <p className="flex text-sm text-gray-500 dark:text-gray-400">
              <span className="material-icons text-base leading-none">
              cake
              </span>
              10 year member
            </p> */}
          </div>
        </div>

        <CardList
          header="Commits"
          items={noteDocsByUser}
          renderItem={({ id, symbol, meta, updatedAt, contentHead }) => (
            <>
              <div className="flex-1 min-w-0">
                <Link href={getNotePageURL(symbol, id)}>
                  <a className="text-gray-900 dark:text-white hover:underline">
                    <SymbolDecorate
                      symbolStr={symbol}
                      title={contentHead.title ?? undefined}
                    />
                    <span className="pl-0.5 font-light text-gray-400 dark:text-white hover:underline">
                      #{id.slice(-6)}
                    </span>
                  </a>
                </Link>
                <p className="pt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  <span className="material-icons-outlined px-0.5 text-sm align-bottom">
                    check_circle
                  </span>
                  {/* {mergeState_text[meta.mergeState]} */}
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 align-right">
                {moment(updatedAt).format('L')}
              </p>
            </>
          )}
        />

        <CardList
          header={
            <>
              <h1 className="leading-none">Latest Discussions</h1>
              <a
                href="#"
                className="text-sm text-blue-600 hover:underline dark:text-blue-500"
              >
                View all
              </a>
            </>
          }
          items={discussesByUser}
          renderItem={({ id, updatedAt, title, noteEntries }) => (
            <>
              <div className="flex-1 min-w-0">
                <Link href={'#'}>
                  <a className="text-blue-700 dark:text-white hover:underline">
                    <span className="pr-0.5 text-gray-300">#</span>
                    {title}
                    <span className="pl-0.5 text-gray-300">#</span>

                    {/* <SymbolDecorate
                      symbolStr={symbol}
                      title={contentHead.title ?? undefined}
                    />
                    <span className="pl-0.5 font-light text-gray-400 dark:text-white hover:underline">
                      #{id.slice(-6)}
                    </span> */}
                  </a>
                </Link>

                <p className="pt-1 text-sm text-gray-500 dark:text-gray-400">
                  {/* <span className="material-icons-outlined px-0.5 text-sm align-bottom">
                    check_circle
                  </span> */}
                  {/* {mergeState_text[meta.mergeState]} */}
                  {/* {noteEntries.map(({ id, sym }) => (
                    <span key={id}>{sym.symbol}</span>
                    // <SymbolDecorate key={id} symbolStr={sym.symbol} />
                  ))} */}
                  <span className="text-gray-300">[[</span>Web3
                  <span className="text-gray-300">]]</span> ·{' '}
                  <span className="text-gray-300">[[</span>Etherum
                  <span className="text-gray-300">]]</span>
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 align-right">
                {moment(updatedAt).format('L')}
              </p>
            </>
          )}
        />

        {/* {data?.author?.meta} */}
        {/* <div className="flex gap-6">
          <div className="w-1/2">
            <UserNoteTable data={noteDocsByUser} />
          </div>
          <div className="w-1/2">
            <UserRateTable data={mockRateData} />
          </div>
        </div> */}

        {/* <div className="mt-8">
          <h4 className="mb-2 text-gray-700 tracking-widest">DISCUSSES</h4>
          <DiscussEntryListGroup data={discussesByUser} />
        </div> */}
      </div>
    </>
  )
}

/**
 * TODO:
 * - Currently draft is not able for server-side rendering
 *   because apollo's schema-link does not have 'request' which session data stored in it
 */
export async function getServerSideProps({
  params,
  res,
}: GetServerSidePropsContext<{ userid: string }>): Promise<
  GetServerSidePropsResult<Props>
> {
  if (params === undefined) throw new Error('params === undefined')
  const { userid: userId } = params

  const client = getApolloClientSSR(),
    qDocs = await client.query<
      NoteDocsByUserQuery,
      NoteDocsByUserQueryVariables
    >({
      query: NoteDocsByUserDocument,
      variables: { userId },
    }),
    qDiscusses = await client.query<
      DiscussesByUserQuery,
      DiscussesByUserQueryVariables
    >({
      query: DiscussesByUserDocument,
      variables: { userId },
    })

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=200, stale-while-revalidate=259',
  )
  return {
    props: {
      userId,
      noteDocsByUser: qDocs.data.noteDocsByUser,
      discussesByUser: qDiscusses.data.discussesByUser,
    },
  }
}

export default UserPage
