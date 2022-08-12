import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import React, { useEffect } from 'react'
import { preventExitWithoutSave } from '../../frontend/components/editor-textarea/src/listeners'
import SlateDocChainEl from '../../frontend/components/editor-slate/src/components/DocChainEl'
import { LayoutChildrenPadding } from '../../frontend/components/ui/layout/layout-children-padding'

interface Props {
  draftId: string
  protected: boolean
}

const DraftIdPage = ({ draftId }: Props) => {
  useEffect(() => {
    // console.debug('DraftIdPage mount')
    window.addEventListener('beforeunload', preventExitWithoutSave)

    return () => {
      // console.debug('DraftIdPage unmount')
      window.removeEventListener('beforeunload', preventExitWithoutSave)
    }
  }, [])

  return (
    <LayoutChildrenPadding>
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

        <SlateDocChainEl
          leadDraftId={draftId}
          hashDraftId={
            window.location.hash !== '' ? window.location.hash.slice(1) : null
          }
        />
      </div>
    </LayoutChildrenPadding>
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
