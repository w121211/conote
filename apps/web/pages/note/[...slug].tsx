import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import React from 'react'
import {
  NoteByBranchSymbolDocument,
  NoteByBranchSymbolQuery,
  NoteByBranchSymbolQueryVariables,
  NoteDocDocument,
  NoteDocFragment,
  NoteDocQuery,
  NoteDocQueryVariables,
  NoteDocsToMergeByNoteDocument,
  NoteDocsToMergeByNoteQuery,
  NoteDocsToMergeByNoteQueryVariables,
  NoteFragment,
  useNoteDraftQuery,
} from '../../apollo/query.graphql'
import { getApolloClientSSR } from '../../apollo/apollo-client-ssr'
import NoteViewEl from '../../frontend/components/note/note-view-el'

interface Props {
  query: {
    symbol?: string
    url?: string
    // page: 'base' | 'doc' | 'edit' | 'view'
    docId: string | null
  }
  note: NoteFragment | null
  noteDocsToMerge: NoteDocFragment[] | null
  noteDocById: NoteDocFragment | null
}

/**
 * TODO:
 * - Move draft query to SSR
 * - Hydrate apollo by received props
 */
const NoteSlugPage = ({
  query: { symbol, url, docId },
  note,
  noteDocById,
  noteDocsToMerge,
}: Props): JSX.Element | null => {
  const qDraft = useNoteDraftQuery({ variables: { symbol } })

  if (qDraft.loading) return null
  if (qDraft.error && qDraft.error.message !== 'Not authenticated')
    throw qDraft.error

  const props = {
    symbol,
    note,
    noteDraft: qDraft.data?.noteDraft ?? null,
  }

  if (note && noteDocById && Array.isArray(noteDocsToMerge)) {
    return (
      <NoteViewEl {...{ ...props, doc: noteDocById, note, noteDocsToMerge }} />
    )
  }
  if (note && Array.isArray(noteDocsToMerge)) {
    return (
      <NoteViewEl {...{ ...props, doc: note.headDoc, note, noteDocsToMerge }} />
    )
  }
  if (symbol) {
    return <div>Note {symbol} is not found, create one.</div>
  }
  if (url) {
    return <div>Note on {url} is not found, create one.</div>
  }
  throw new Error('')
}

/**
 * Catch routes
 * - /note/[symbol]
 * - /note/[symbol]/doc/[docid]
 *
 * - /note/Hello_world
 * - /note/www.hello.world/sub/directory?wq_a=aaa+wq_b=bbb
 * - /note?u=https://www.hello.world/sub/directory?a=aaa+b=bbb
 * - /note?s=Hello+world
 *
 * TODO:
 * - Currently draft is not able for server-side rendering
 *   because apollo's schema-link does not have 'request' which session data stored in it
 */
export async function getServerSideProps({
  params,
  query,
  res,
}: GetServerSidePropsContext<{ slug: string[] }>): Promise<
  GetServerSidePropsResult<Props>
> {
  if (params === undefined) throw new Error('params === undefined')

  const { slug } = params

  let symbol: string,
    docId: string | null = null

  if (slug.length === 1) {
    symbol = slug[0]
  } else if (slug.length === 3 && slug[1] === 'doc') {
    symbol = slug[0]
    docId = slug[2] ? slug[2] : null
  } else {
    throw new Error('slug.length expect to be 1 or 3')
  }

  const client = getApolloClientSSR(),
    qNote = await client.query<
      NoteByBranchSymbolQuery,
      NoteByBranchSymbolQueryVariables
    >({
      query: NoteByBranchSymbolDocument,
      variables: { branch: 'default', symbol },
    }),
    qDoc =
      docId &&
      (await client.query<NoteDocQuery, NoteDocQueryVariables>({
        query: NoteDocDocument,
        variables: { id: docId },
      })),
    qDocsToMerge =
      qNote.data.noteByBranchSymbol &&
      (await client.query<
        NoteDocsToMergeByNoteQuery,
        NoteDocsToMergeByNoteQueryVariables
      >({
        query: NoteDocsToMergeByNoteDocument,
        variables: { noteId: qNote.data.noteByBranchSymbol.id },
      }))

  // Caching, see https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props#caching-with-server-side-rendering-ssr
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=200, stale-while-revalidate=259',
  )

  return {
    props: {
      query: { symbol, docId },
      note: qNote.data.noteByBranchSymbol ?? null,
      noteDocById: qDoc ? qDoc.data.noteDoc : null,
      noteDocsToMerge: qDocsToMerge
        ? qDocsToMerge.data.noteDocsToMergeByNote
        : null,
    },
  }
}

export default NoteSlugPage
