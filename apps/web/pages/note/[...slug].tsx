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
  NoteDraftFragment,
  NoteFragment,
  useNoteDocsToMergeByNoteQuery,
  useNoteDraftQuery,
} from '../../apollo/query.graphql'
import { getApolloClientSSR } from '../../apollo/apollo-client-ssr'
import { EditorEl } from '../../components/block-editor/src/components/editor/editor-el'
import Layout from '../../components/ui-component/layout'
import { editorOpenSymbolInMain } from '../../components/block-editor/src/events'
import { BlockViewerEl } from '../../components/block-editor/src/components/block/block-viewer-el'
import { convertGQLBlocks } from '../../components/block-editor/src/services/note-draft.service'
import { getNotePageURL } from '../../shared/note-helpers'

const NoteDocLink = ({ doc }: { doc: NoteDocFragment }) => {
  return (
    <Link href={getNotePageURL('doc', doc.symbol, doc.id)}>
      <a>#{doc.id.slice(-6)}</a>
    </Link>
  )
}

/**
 * Show alert cases
 * - If current viewing doc is not the head
 * - If there are docs waiting to merge
 *
 * TODO
 * - Remember user's action?
 */
const NoteAlerts = ({
  cur,
  note,
  noteDocsToMerge,
}: {
  cur: NoteDocFragment | NoteDraftFragment
  note: NoteFragment | null
  noteDocsToMerge: NoteDocFragment[] | null
}) => {
  return (
    <div>
      {cur.__typename === 'NoteDoc' && note && cur.id !== note.headDoc.id && (
        <div>The current viewing doc is not the head.</div>
      )}
      {noteDocsToMerge && noteDocsToMerge.length > 0 && (
        <div>
          {noteDocsToMerge.map(e => (
            <span key={e.id}>
              Doc <NoteDocLink doc={e} />
            </span>
          ))}
          is/are waiting to merge.
        </div>
      )}
    </div>
  )
}

/**
 * Loads the given draft or open a blank note in the editor
 */
const NoteEditEl = ({
  symbol,
  note,
  noteDocsToMerge,
}: {
  symbol: string
  note: NoteFragment | null
  noteDocsToMerge: NoteDocFragment[] | null
}) => {
  const router = useRouter()

  useEffect(() => {
    // Call this method only when symbol changed
    editorOpenSymbolInMain(symbol, router)
  }, [symbol])

  // const onUnload = (e: BeforeUnloadEvent) => {
  //   e.preventDefault()
  //   // if (mainDoc?.doc) {
  //   //   // workspace.save(mainDoc.doc)
  //   //   console.log('save')
  //   //   workspace.save(mainDoc.doc)
  //   //   // return 'save'
  //   // }
  //   // console.log(router)
  //   // if () {
  //   //   // return null
  //   // }
  //   e.returnValue = 'leave'
  //   return 'leave'
  //   // return null
  // }

  // useEffect(() => {
  //   window.addEventListener('beforeunload', onUnload)
  //   return () => window.removeEventListener('beforeunload', onUnload)
  // }, [])

  return (
    <>
      <Layout
        buttonRight={
          <>
            {/* {mainDoc?.doc && <NoteMetaModal doc={mainDoc.doc} />}
            {mainDoc?.doc?.noteCopy && (
              <div className="inline-block z-20">
                <HeaderNoteEmojis noteId={mainDoc.doc.noteCopy.id} />
              </div>
            )} */}

            {/* <button
              className=" p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
              onClick={() => {
                if (mainDoc?.doc) {
                  workspace.save(mainDoc.doc)
                }
              }}
            >
              <span className="material-icons-outlined text-xl leading-none ">
                save
              </span>
            </button>
            
            <button className=" p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100">
              <span className="material-icons-outlined text-xl leading-none ">
                more_horiz
              </span>
            </button> */}

            {/* <AuthItem /> */}
          </>
        }
      >
        <EditorEl />
      </Layout>
    </>
  )
}

/**
 * Only show if note is created
 */
const NoteDocSelectDropdown = ({
  cur,
  note,
}: {
  cur: NoteDocFragment | NoteDraftFragment
  note: NoteFragment
}): JSX.Element => {
  const { symbol } = note.sym,
    qDocsToMerge = useNoteDocsToMergeByNoteQuery({
      variables: { noteId: note.id },
    })

  let curLabel = ''
  if (cur.__typename === 'NoteDraft') {
    curLabel = 'Draft'
  } else if (cur.__typename === 'NoteDoc') {
    curLabel = cur.id === note.headDoc.id ? 'Head' : cur.id.slice(-6)
  }

  return (
    <div>
      Viewing {curLabel}
      <div>
        {cur.__typename === 'NoteDraft' && (
          <Link href={getNotePageURL('edit', symbol)}>
            <a>Draft</a>
          </Link>
        )}
        {note && (
          <Link href={getNotePageURL('view', symbol)}>
            <a>Head</a>
          </Link>
        )}
        {qDocsToMerge.data &&
          qDocsToMerge.data.noteDocsToMergeByNote.map(e => (
            <NoteDocLink key={e.id} doc={e} />
          ))}
      </div>
    </div>
  )
}

/**
 * View only note-doc
 */
const NoteViewEl = ({
  doc,
  note,
  noteDocsToMerge,
}: {
  doc: NoteDocFragment
  note: NoteFragment
  noteDocsToMerge: NoteDocFragment[] | null
}) => {
  const isHeadDoc = doc.id === note.headDoc.id,
    { blocks, docBlock } = convertGQLBlocks(doc.contentBody.blocks)

  return (
    <Layout>
      <NoteAlerts cur={doc} note={note} noteDocsToMerge={noteDocsToMerge} />
      <NoteDocSelectDropdown cur={doc} note={note} />

      <div>
        <Link href={getNotePageURL('edit', note.sym.symbol)}>
          <a>edit</a>
        </Link>
      </div>

      {/* <div>Content head</div> */}
      {/* <NoteHead /> */}

      <BlockViewerEl blocks={blocks} uid={docBlock.uid} />
    </Layout>
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

  const el = React.createElement

  if (page === 'base') {
    if (qDraft.data?.noteDraft) {
      return el(NoteEditEl, { symbol, note, noteDocsToMerge })
    }
    if (note) {
      return el(NoteViewEl, { doc: note.headDoc, note, noteDocsToMerge })
    }
    return el(NoteEditEl, { symbol, note, noteDocsToMerge })
  }
  if (page === 'edit') {
    return el(NoteEditEl, { symbol, note, noteDocsToMerge })
  }
  if (page === 'view' && note) {
    return el(NoteViewEl, { doc: note.headDoc, note, noteDocsToMerge })
  }
  if (page === 'doc' && note && noteDoc) {
    return el(NoteViewEl, { doc: noteDoc, note, noteDocsToMerge })
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
