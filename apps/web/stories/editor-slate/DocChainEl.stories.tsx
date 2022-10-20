import React, { useEffect, useRef } from 'react'
import { ComponentMeta } from '@storybook/react'
import ModalProvider from '../../frontend/components/modal/modal-context'
import DocChainEl from '../../frontend/components/editor-slate/src/components/DocChainEl'
import { noteDraftService } from '../../frontend/components/editor-textarea/src/services/note-draft.service'
import { editorChainsRefresh } from '../../frontend/components/editor-textarea/src/events'

export default {
  component: DocChainEl,
} as ComponentMeta<typeof DocChainEl>

export const Base = () => {
  const ref = useRef<string | null>(null)

  useEffect(() => {
    async function run() {
      const entries = await noteDraftService.queryMyAllDraftEntries()

      await editorChainsRefresh()
      // await editorChainItemOpen(entries[0].id)

      ref.current = entries[0].id
    }
    run()
  }, [])

  return (
    <ModalProvider>
      {ref.current && (
        <DocChainEl leadDraftId={ref.current} anchorDraftId={ref.current} />
      )}
    </ModalProvider>
  )
}
