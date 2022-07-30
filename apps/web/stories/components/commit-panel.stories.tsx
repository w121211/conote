import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CommitPanel } from '../../frontend/components/commit/commit-panel'
import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from '../../apollo/apollo-client'
import ModalProvider from '../../frontend/components/modal/modal-context'

const apolloClient = getApolloClient()

export default {
  // title: 'Components/CommitPanel',
  component: CommitPanel,
} as ComponentMeta<typeof CommitPanel>

const Template: ComponentStory<typeof CommitPanel> = args => (
  <ApolloProvider client={apolloClient}>
    <ModalProvider>
      <CommitPanel />
    </ModalProvider>
  </ApolloProvider>
)

export const Basic = Template.bind({})
// Basic.args = {
//   uid: mockBlocks[0].uid,
//   // uid: mockLocalDoc.blocks[0].uid,
//   isEditable: true,
// }
