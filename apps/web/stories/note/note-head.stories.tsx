import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { NoteHead } from '../../components/note/note-head'
import ModalProvider from '../../components/modal/modal-context'
import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from '../../apollo/apollo-client'

export const mockDate = new Date()
export const mockLink =
  'https://arstechnica.com/information-technology/2022/03/first-microsoft-then-okta-new-ransomware-gang-posts-data-from-both/'

const apolloClient = getApolloClient()

export default {
  component: NoteHead,
} as ComponentMeta<typeof NoteHead>

const Template: ComponentStory<typeof NoteHead> = args => (
  <ApolloProvider client={apolloClient}>
    <ModalProvider>
      <NoteHead {...args} />
    </ModalProvider>
  </ApolloProvider>
)

export const Symbol = Template.bind({})
Symbol.args = {
  symbol: '[[Awesome Tailwind CSS]]',
  isNew: true,
  nodeId: '12345',
}

export const Web = Template.bind({})
Web.args = {
  symbol: ' mockLink',
  isNew: true,
  fetchTime: undefined,
  link: 'http://www.xxxx.com',
  title: 'First Microsoft, then Okta: New ransomware gang posts data from both',
  nodeId: '12345',
}
Web.argTypes = {
  title: {
    options: [
      'First Microsoft, then Okta: New ransomware gang posts data from both',
      undefined,
    ],
  },
}
