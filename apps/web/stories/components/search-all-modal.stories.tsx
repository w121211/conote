import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { getApolloClient } from '../../apollo/apollo-client'
import ModalProvider from '../../components/modal/modal-context'
import SearchAllModal from '../../components/search-all-modal/search-all-modal'

const apolloClient = getApolloClient()

export default {
  component: SearchAllModal,
  decorators: [
    Story => (
      <div style={{ width: '30%', margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      values: [
        { name: 'dark', value: 'rgb(55 65 81)' },
        { name: 'gray', value: 'rgb(243 244 246)' },
        { name: 'white', value: '#fff' },
      ],
    },
  },
} as ComponentMeta<typeof SearchAllModal>

const Template: ComponentStory<typeof SearchAllModal> = _ => (
  <ApolloProvider client={apolloClient}>
    <ModalProvider>
      <SearchAllModal />
    </ModalProvider>
  </ApolloProvider>
)

export const Default = Template.bind({})
