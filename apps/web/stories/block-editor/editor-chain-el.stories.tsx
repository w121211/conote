import React, { useEffect, useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import ModalProvider from '../../frontend/components/modal/modal-context'
import { EditorToolbar } from '../../frontend/components/block-editor/src/components/editor/editor-toolbar'
import { noteService } from '../../frontend/components/block-editor/src/services/note.service'
import { noteDraftService } from '../../frontend/components/block-editor/src/services/note-draft.service'
import {
  editorChainOpen,
  editorChainsRefresh,
  editorLeftSidebarRefresh,
} from '../../frontend/components/block-editor/src/events'
import { EditorChainEl } from '../../frontend/components/block-editor/src/components/editor/editor-chain-el'

export default {
  title: 'BlockEditor/EditorChainEl',
  component: EditorChainEl,
} as ComponentMeta<typeof EditorChainEl>

export const Basic = () => {
  useEffect(() => {
    async function run() {
      const entries = await noteDraftService.queryMyAllDraftEntries(),
        chains = [entries]
      await editorChainsRefresh()
      await editorChainOpen(entries[0].id)
    }
    run()
  }, [])

  return (
    <ModalProvider>
      <EditorChainEl />
    </ModalProvider>
  )
}
