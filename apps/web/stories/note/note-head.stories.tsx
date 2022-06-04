import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { nanoid } from 'nanoid'
// import { NoteFragment } from '../apollo/query.graphql'
import { LiElement } from '../../components/editor/slate-custom-types'
import { NoteHead } from '../../components/note-head'
import { Doc } from '../../components/workspace/doc'
import ModalProvider from '../../components/modal/modal-context'
import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from '../../apollo/apollo-client'

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
