import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import React, { useEffect } from 'react'
import { EditorChainEl } from '../../frontend/components/block-editor/src/components/editor/editor-chain-el'
import { editorChainItemOpen } from '../../frontend/components/block-editor/src/events'
import { preventExitWithoutSave } from '../../frontend/components/block-editor/src/listeners'
import SlateEditorChainEl from '../../frontend/components/slate-editor/src/components/slate-editor-chain-el'
import { LayoutChildrenPadding } from '../../frontend/components/ui-component/layout/layout-children-padding'

interface Props {
  draftId: string
  protected: boolean
}

const DraftIdPage = ({ draftId }: Props): JSX.Element | null => {
  useEffect(() => {
    window.addEventListener('beforeunload', preventExitWithoutSave)
    return () =>
      window.removeEventListener('beforeunload', preventExitWithoutSave)
  }, [])

  useEffect(() => {
    editorChainItemOpen(draftId)
  }, [draftId])

  return (
    <LayoutChildrenPadding>
      <div className="pb-32">
        <div className="flex">
          {/* {note && (
            <NoteDocVersionDropdown
              cur={noteDraft}
              note={note}
              noteDraft={noteDraft}
            />
          )} */}
        </div>
        {/* <EditorChainEl /> */}
        <SlateEditorChainEl />
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
