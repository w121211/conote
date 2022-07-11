import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import React, { useEffect } from 'react'
import { EditorChainEl } from '../../frontend/components/block-editor/src/components/editor/editor-chain-el'
import { editorChainItemOpen } from '../../frontend/components/block-editor/src/events'
import { preventSave } from '../../frontend/components/block-editor/src/listeners'
import { LayoutChildrenPadding } from '../../frontend/components/ui-component/layout/layout-children-padding'

interface Props {
  draftId: string
  protected: boolean
}

const DraftIdPage = ({ draftId }: Props): JSX.Element | null => {
  useEffect(() => {
    window.addEventListener('beforeunload', preventSave)
    return () => window.removeEventListener('beforeunload', preventSave)
  }, [])

  useEffect(() => {
    editorChainItemOpen(draftId)
  }, [draftId])

  return (
    <LayoutChildrenPadding>
      <div className="pb-32">
        <div className="flex">
          <div className="flex-1">Editing</div>
          {/* {note && (
            <NoteDocVersionDropdown
              cur={noteDraft}
              note={note}
              noteDraft={noteDraft}
            />
          )} */}
        </div>
        <EditorChainEl />
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
