import React, { useEffect, useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import ModalProvider from '../../frontend/components/modal/modal-context'
import { noteDraftService } from '../../frontend/components/editor-textarea/src/services/note-draft.service'
import { editorChainsRefresh } from '../../frontend/components/editor-textarea/src/events'
import { EditorChainEl } from '../../frontend/components/editor-textarea/src/components/editor/editor-chain-el'

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
      // await editorChainItemOpen(entries[0].id)
    }
    run()
  }, [])

  return (
    <ModalProvider>
      <EditorChainEl />
    </ModalProvider>
  )
}
