import React, { useEffect } from 'react'
import { ComponentMeta } from '@storybook/react'
import ModalProvider from '../../frontend/components/modal/modal-context'
import SlateEditorChainEl from '../../frontend/components/slate-editor/src/components/slate-editor-chain-el'
import { noteDraftService } from '../../frontend/components/block-editor/src/services/note-draft.service'
import {
  editorChainItemOpen,
  editorChainsRefresh,
} from '../../frontend/components/block-editor/src/events'

export default {
  title: 'SlateEditor/SlateEditorChainEl',
  component: SlateEditorChainEl,
} as ComponentMeta<typeof SlateEditorChainEl>

export const Base = () => {
  useEffect(() => {
    async function run() {
      const entries = await noteDraftService.queryMyAllDraftEntries(),
        chains = [entries]

      await editorChainsRefresh()
      await editorChainItemOpen(entries[0].id)
    }
    run()
  }, [])

  return (
    <ModalProvider>
      <SlateEditorChainEl />
    </ModalProvider>
  )
}
