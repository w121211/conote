import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import CommitFormModal from '../../frontend/components/commit/CommitSubmitModal'
import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from '../../apollo/apollo-client'
import ModalProvider from '../../frontend/components/modal/modal-context'

const apolloClient = getApolloClient()

export default {
  // title: 'Components/CommitPanel',
  component: CommitFormModal,
} as ComponentMeta<typeof CommitFormModal>

const Template: ComponentStory<typeof CommitFormModal> = args => (
  <ApolloProvider client={apolloClient}>
    <ModalProvider>
      <CommitFormModal />
    </ModalProvider>
  </ApolloProvider>
)

export const Basic = Template.bind({})
// Basic.args = {
//   uid: mockBlocks[0].uid,
//   // uid: mockLocalDoc.blocks[0].uid,
//   isEditable: true,
// }
