import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import NoteViewEl from '../../frontend/components/note/note-view-el'
import { NoteFragment } from '../../apollo/query.graphql'
import { mockNoteFragments } from '../../test/__mocks__/note-fragment.mock'
import { mockNoteDocFragments } from '../../test/__mocks__/note-doc-fragment.mock'

export default {
  component: NoteViewEl,
} as ComponentMeta<typeof NoteViewEl>

// const apolloClient = getApolloClient()
// const Template: ComponentStory<typeof NoteViewEl> = args => (
//   <ApolloProvider client={apolloClient}>
//     <ModalProvider>
//       <NoteViewEl {...args} />
//     </ModalProvider>
//   </ApolloProvider>
// )

export const Base = () => {
  // BUG: When import mockNoteDocFragments, storybook will not render -> unknow reason
  const doc = mockNoteDocFragments[0]
  const note: NoteFragment = {
    ...mockNoteFragments[0],
    headDoc: doc,
  }
  const props = {
    doc,
    note,
    noteDocsToMerge: [],
    noteDraft: null,
  }
  return <NoteViewEl {...props} />
}
