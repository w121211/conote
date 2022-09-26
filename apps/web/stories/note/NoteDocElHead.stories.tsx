import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { getApolloClient } from '../../apollo/apollo-client'
import ModalProvider from '../../frontend/components/modal/modal-context'
import NoteDocElHead from '../../frontend/components/note/NoteDocElHead'
import { mockNoteDocFragments } from '../../test/__mocks__/note-doc-fragment.mock'

export default {
  component: NoteDocElHead,
} as ComponentMeta<typeof NoteDocElHead>

const apolloClient = getApolloClient()

export const Base = () => {
  const [showModal, setShowModal] = useState(false)

  const props = {
    symbol: mockNoteDocFragments[0].symbol,
    doc: mockNoteDocFragments[0],
    isHeadDoc: true,
    setShowMergePollModal: setShowModal,
  }

  return (
    <ApolloProvider client={apolloClient}>
      <ModalProvider>
        <div className="container mx-auto py-4">
          <NoteDocElHead {...props} />
        </div>
      </ModalProvider>
    </ApolloProvider>
  )
}
