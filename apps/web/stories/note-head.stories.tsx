import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { nanoid } from 'nanoid'
// import { NoteFragment } from '../apollo/query.graphql'
import { LiElement } from '../components/editor/slate-custom-types'
import { NoteHead } from '../components/note-head'
import { Doc } from '../components/workspace/doc'
import { mockDate, mockLink } from './mock-data'
import ModalProvider from '../components/modal/modal-context'

export default {
  title: 'component/Note Head',
  component: NoteHead,
} as ComponentMeta<typeof NoteHead>

const Template: ComponentStory<typeof NoteHead> = args => (
  <ModalProvider>
    <NoteHead {...args} />
  </ModalProvider>
)

export const Symbol = Template.bind({})
Symbol.args = {
  symbol: '[[Awesome Tailwind CSS]]',
  isNew: true,
  nodeId: '12345',
}

export const Web = Template.bind({})
Web.args = {
  symbol: '@' + mockLink,
  isNew: true,
  fetchTime: mockDate,
  link: mockLink,
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
