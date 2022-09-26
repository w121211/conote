import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { getApolloClient } from '../../apollo/apollo-client'
import ModalProvider from '../../frontend/components/modal/modal-context'
import NoteDocElAlerts from '../../frontend/components/note/NoteDocElAlerts'
import { mockNoteDocFragments } from '../../test/__mocks__/note-doc-fragment.mock'
import { mockNoteFragments } from '../../test/__mocks__/note-fragment.mock'

export default {
  component: NoteDocElAlerts,
} as ComponentMeta<typeof NoteDocElAlerts>

const apolloClient = getApolloClient()

const Template: ComponentStory<typeof NoteDocElAlerts> = args => {
  const [showModal, setShowModal] = useState(false)
  return (
    <ApolloProvider client={apolloClient}>
      <ModalProvider>
        <div className="container mx-auto py-4">
          <NoteDocElAlerts
            {...{ ...args, setShowMergePollModal: setShowModal }}
          />
        </div>
      </ModalProvider>
    </ApolloProvider>
  )
}

export const Head = Template.bind({})
Head.args = {
  doc: mockNoteDocFragments[0],
  note: {
    ...mockNoteFragments[0],
    headDoc: mockNoteDocFragments[0],
  },
  noteDocsToMerge: mockNoteDocFragments,
}

export const NotHead = Template.bind({})
NotHead.args = {
  doc: mockNoteDocFragments[4],
  note: {
    ...mockNoteFragments[0],
    headDoc: mockNoteDocFragments[0],
  },
  noteDocsToMerge: mockNoteDocFragments,
}

// export const NotHead = () => {
//   const [showModal, setShowModal] = useState(false)
//   const props = {
//     doc: mockNoteDocFragments[0],
//     note: {
//       ...mockNoteFragments[0],
//       headDoc: mockNoteDocFragments[0],
//     },
//     noteDocsToMerge: mockNoteDocFragments,
//     setShowMergePollModal: setShowModal,
//   }

//   return (
//     <ApolloProvider client={apolloClient}>
//       <ModalProvider>
//         <div className="container mx-auto py-4">
//           <NoteDocElAlerts {...props} />
//         </div>
//       </ModalProvider>
//     </ApolloProvider>
//   )
// }
