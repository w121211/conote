import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import NoteDocEl from '../../frontend/components/note/NoteDocEl'
import { NoteFragment } from '../../apollo/query.graphql'
import { mockNoteFragments } from '../../test/__mocks__/note-fragment.mock'
import { mockNoteDocFragments } from '../../test/__mocks__/note-doc-fragment.mock'
import { ApolloProvider } from '@apollo/client'
import ModalProvider from '../../frontend/components/modal/modal-context'
import { getApolloClient } from '../../apollo/apollo-client'

export default {
  component: NoteDocEl,
} as ComponentMeta<typeof NoteDocEl>

const apolloClient = getApolloClient()

export const Base = () => {
  const doc = mockNoteDocFragments[1]
  const note: NoteFragment = {
    ...mockNoteFragments[1],
    headDoc: doc,
  }
  const props = {
    doc,
    note,
    noteDocsToMerge: [],
    noteDraft: null,
  }
  return (
    <ApolloProvider client={apolloClient}>
      <ModalProvider>
        <div className="max-w-2xl container mx-auto">
          <NoteDocEl {...props} />
        </div>
      </ModalProvider>
    </ApolloProvider>
  )
}
