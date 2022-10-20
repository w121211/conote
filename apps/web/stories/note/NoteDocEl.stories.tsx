import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import NoteDocEl from '../../frontend/components/note/NoteDocEl'
import { NoteDocFragment, NoteFragment } from '../../apollo/query.graphql'
import { mockNoteFragments } from '../../test/__mocks__/note-fragment.mock'
import { mockNoteDocFragments } from '../../test/__mocks__/note-doc-fragment.mock'
import { getApolloClient } from '../../apollo/apollo-client'
import { mockBlockInputs } from '../../frontend/components/editor-textarea/test/__mocks__/mock-block'
import { writeBlocks } from '../../frontend/components/editor-textarea/src/utils/block-writer'
import ModalProvider from '../../frontend/components/modal/modal-context'

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

export const WebNote = () => {
  const doc: NoteDocFragment = {
    ...mockNoteDocFragments[1],
    contentBody: {
      ...mockNoteDocFragments[1].contentBody,
      blocks: writeBlocks(mockBlockInputs[2]),
    },
  }
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
