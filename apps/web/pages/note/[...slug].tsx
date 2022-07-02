import { isNil } from 'lodash'
import React, { useEffect } from 'react'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
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
import { getNotePageURL } from '../../components/page-utils'
import NoteEditEl from '../../components/note/note-edit-el'
import NoteViewEl from '../../components/note/note-view-el'

const NoteDocLink = ({ doc }: { doc: NoteDocFragment }) => {
  return (
    <Link href={getNotePageURL('doc', doc.symbol, doc.id)}>
      <a>#{doc.id.slice(-6)}</a>
    </Link>
  )
}

interface Props {
  url: {
    symbol: string
    page: 'base' | 'doc' | 'edit' | 'view'
    docId: string | null
  }
  note: NoteFragment | null
  noteDoc: NoteDocFragment | null
  noteDocsToMerge: NoteDocFragment[] | null
}

/**
 * Catch routes
 * - /note/[symbol]?view=1    Enforce viewer
 *   - If has no note, fallback to '/note/[symbol]'
 * - /note/[symbol]
 *   - If has draft, open the editor and and shallow update url to /note/[symbol]/edit
 *   - If has no draft, show note's head-doc
 *   - If has no note nor draft, open the editor with blank page
 *     and shallow update url to /note/[symbol]/edit
 * - /note/[symbol]/edit
 *   - If has no draft fallback to /note/[symbol]
 * - /note/[symbol]/doc/[docid]
 *
 * TODO:
 * - Move draft query to SSR
 * - Hydrate apollo by received props
 */
const NoteSlugPage = ({
  url: { symbol, page },
  note,
  noteDoc,
  noteDocsToMerge,
}: Props): JSX.Element | null => {
  const router = useRouter(),
    qDraft = useNoteDraftQuery({ variables: { symbol } })

  useEffect(() => {
    if (page === 'base' && !qDraft.loading) {
      if (qDraft.data?.noteDraft || note === null) {
        router.replace(getNotePageURL('edit', symbol), undefined, {
          shallow: true,
        })
      }
    }
  }, [qDraft])

  if (qDraft.loading) return null
  if (qDraft.error && qDraft.error.message !== 'Not authenticated')
    throw qDraft.error

  const el = React.createElement,
    props = {
      symbol,
      note,
      noteDraft: qDraft.data?.noteDraft ?? null,
      noteDocsToMerge,
    }

  if (page === 'base') {
    if (qDraft.data?.noteDraft) {
      return el(NoteEditEl, props)
    }
    if (note) {
      return el(NoteViewEl, {
        ...props,
        doc: note.headDoc,
        note,
      })
    }
    return el(NoteEditEl, props)
  }
  if (page === 'edit') {
    return el(NoteEditEl, props)
  }
  if (page === 'view' && note) {
    return el(NoteViewEl, { ...props, doc: note.headDoc, note })
  }
  if (page === 'doc' && note && noteDoc) {
    return el(NoteViewEl, { ...props, doc: noteDoc, note })
  }
  throw new Error('Unexpected error')
}

function isEditOrDoc(s: string): s is 'edit' | 'doc' {
  return ['edit', 'doc'].includes(s)
}

/**
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

  const { slug } = params,
    { view } = query

  let symbol: string,
    page: Props['url']['page'] = 'base',
    docId: string | null = null

  if (slug.length === 1) {
    symbol = slug[0]
    if (view) page = 'view'
  } else if (slug.length > 1 && slug.length <= 3) {
    symbol = slug[0]
    docId = slug[2] ? slug[2] : null

    const p = slug[1]
    if (isEditOrDoc(p)) {
      page = p
    } else {
      return { notFound: true }
    }
  } else {
    throw new Error('slug.length expect to be 1, 2, or 3')
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
      page === 'doc' &&
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

  // Fallback to base page
  if (page === 'view' && isNil(qNote.data.noteByBranchSymbol)) page = 'base'

  // Caching, see https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props#caching-with-server-side-rendering-ssr
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=200, stale-while-revalidate=259',
  )

  return {
    props: {
      url: { symbol, page, docId },
      note: qNote.data.noteByBranchSymbol ?? null,
      noteDoc: qDoc ? qDoc.data.noteDoc : null,
      noteDocsToMerge: qDocsToMerge
        ? qDocsToMerge.data.noteDocsToMergeByNote
        : null,
    },
  }
}

export default NoteSlugPage
