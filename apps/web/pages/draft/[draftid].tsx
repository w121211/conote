import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import React, { useEffect } from 'react'
import DocChainEl from '../../frontend/components/editor-slate/src/components/DocChainEl'
import { pageBeforeUnload } from '../../frontend/components/editor-slate/src/events'

interface Props {
  draftId: string
  protected: boolean
}

const DraftIdPage = ({ draftId }: Props) => {
  useEffect(() => {
    // console.debug('DraftIdPage mount')
    window.addEventListener('beforeunload', pageBeforeUnload, { capture: true })

    return () => {
      // console.debug('DraftIdPage unmount')
      window.removeEventListener('beforeunload', pageBeforeUnload)
    }
  }, [])

  return (
    <div className="pb-32">
      {/* <div className="flex">
          {note && (
            <NoteDocVersionDropdown
              cur={noteDraft}
              note={note}
              noteDraft={noteDraft}
            />
          )}
        </div> */}

      <DocChainEl
        leadDraftId={draftId}
        anchorDraftId={
          window.location.hash !== '' ? window.location.hash.slice(1) : null
        }
      />
    </div>
  )
}

export async function getServerSideProps({
  params,
}: GetServerSidePropsContext<{ draftid: string }>): Promise<
  GetServerSidePropsResult<Props>
> {
  if (params === undefined) throw new Error('params === undefined')

  const { draftid } = params

  return {
    props: {
      draftId: draftid,
      protected: true,
    },
  }
}

export default DraftIdPage
