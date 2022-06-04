import React, { useEffect } from 'react'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useRouter } from 'next/router'
import {
  NoteByBranchSymbolDocument,
  NoteByBranchSymbolQuery,
  NoteByBranchSymbolQueryVariables,
  NoteDocContentBodyFragment,
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
import Link from 'next/link'
import { editorOpenSymbolInMain } from '../../components/block-editor/src/events'
import { UrlObject } from 'url'
import { BlockViewerEl } from '../../components/block-editor/src/components/block/block-viewer-el'
import { convertGQLBlocks } from '../../components/block-editor/src/services/note-draft.service'
import { NoteHead } from '../../components/note/note-head'
import { getNotePageURL } from '../../shared/note-helpers'

/**
 * Show alert cases
 * - If is viewing doc and the doc not current head
 * - If is editing draft and there are waiting to merge docs
 */
const NoteAlerts = ({
  curDoc,
  curDraft,
  note,
}: {
  curDoc?: NoteDocFragment
  curDraft?: NoteDraftFragment
  note: NoteFragment
}) => {
  return <div></div>
}

/**
 * Loads the given draft or open a blank note in the editor
 */
const NoteEditEl = ({
  symbol,
  note,
}: {
  symbol: string
  note: NoteFragment | null
}) => {
  const router = useRouter()

  useEffect(() => {
    // Only open if symbol has changed
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

const NoteDocDropdown = ({
  note,
  draft,
}: {
  note: NoteFragment
  draft?: NoteDraftFragment
}): JSX.Element => {
  const { symbol } = note.sym,
    qDocsToMerge = useNoteDocsToMergeByNoteQuery({
      variables: { noteId: note.id },
    })
  return (
    <div>
      {draft && (
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
          <Link key={e.id} href={getNotePageURL('doc', symbol, e.id)}>
            <a>Doc to merge #{e.id}</a>
          </Link>
        ))}
    </div>
  )
}

const NoteDocContentBodyEl = ({
  contentBody,
}: {
  contentBody: NoteDocContentBodyFragment
}) => {
  const { blocks } = contentBody
}

/**
 * View only note-doc
 */
const NoteViewEl = ({
  doc,
  note,
}: {
  doc: NoteDocFragment
  note: NoteFragment
}) => {
  const isHeadDoc = doc.id === note.headDoc.id,
    { blocks, docBlock } = convertGQLBlocks(doc.contentBody.blocks)

  return (
    <div>
      <NoteAlerts curDoc={doc} note={note} />
      <NoteDocDropdown note={note} />

      <div>
        <Link href={getNotePageURL('edit', note.sym.symbol)}>
          <a>edit</a>
        </Link>
      </div>

      {/* <div>Content head</div> */}
      {/* <NoteHead /> */}

      <BlockViewerEl blocks={blocks} uid={docBlock.uid} />
    </div>
  )
}

interface Props {
  url: {
    symbol: string
    page: 'view' | 'edit' | 'doc' | null
    docId: string | null
  }
  note: NoteFragment | null
  noteDoc: NoteDocFragment | null
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
 */
const NoteSlugPage = ({
  url: { symbol, page },
  note,
  noteDoc,
}: Props): JSX.Element | null => {
  const router = useRouter(),
    qDraft = useNoteDraftQuery({ variables: { symbol } })

  useEffect(() => {
    if (page === null && !qDraft.loading) {
      if (qDraft.data?.noteDraft || note === null) {
        router.replace(getNotePageURL('edit', symbol), undefined, {
          shallow: true,
        })
      }
    }
  }, [qDraft])

  if (qDraft.error) throw qDraft.error
  if (qDraft.loading) return null

  if (page === 'edit') {
    return <NoteEditEl symbol={symbol} note={note} />
  }
  if (page === 'view' && note) {
    return <NoteViewEl doc={note.headDoc} note={note} />
  }
  if (page === 'doc' && note && noteDoc) {
    return <NoteViewEl doc={noteDoc} note={note} />
  }
  if (page === null) {
    if (qDraft.data?.noteDraft) {
      return <NoteEditEl symbol={symbol} note={note} />
    }
    if (note) {
      return <NoteViewEl doc={note.headDoc} note={note} />
    }
    return <NoteEditEl symbol={symbol} note={null} />
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
    page: Props['url']['page'] = null,
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
      }))

  // Fallback to null page
  if (
    page === 'view' &&
    (qNote.data.noteByBranchSymbol === undefined ||
      qNote.data.noteByBranchSymbol === null)
  ) {
    page = null
  }

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
    },
  }
}

export default NoteSlugPage
