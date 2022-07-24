import React, { useEffect, useRef, useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import ModalProvider from '../../frontend/components/modal/modal-context'
import { getApolloClient } from '../../apollo/apollo-client'
import { EditorEl } from '../../frontend/components/editor-slate/src/indenter/components/editor-el'
import { blocksToIndenters } from '../../frontend/components/editor-slate/src/indenter/serializers'
import { mockDocBlock_contentBlocks } from '../../frontend/components/editor-textarea/test/__mocks__/mock-block'

const apolloClient = getApolloClient()

const [root, ...indenters] = blocksToIndenters(mockDocBlock_contentBlocks)

export default {
  title: 'EditorSlate/IndenterEditorEl',
  component: EditorEl,
} as ComponentMeta<typeof EditorEl>

export const Base = () => {
  return (
    <ModalProvider>
      <EditorEl initialValue={indenters} />
    </ModalProvider>
  )
}
