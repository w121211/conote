import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { nanoid } from 'nanoid'
import { NoteFragment } from '../apollo/query.graphql'
import { LiElement } from '../components/editor/slate-custom-types'
import NoteHead from '../components/note-head'
import { Doc } from '../components/workspace/doc'

const date = new Date()

const mockNote: NoteFragment = {
  __typename: 'Note',
  id: nanoid(),
  updatedAt: date,
  link: {
    __typename: 'Link',
    id: nanoid(),
    url: 'http://www.google.com',
    authorId: null,
  },
}

const templateContent: LiElement[] = [
  { type: 'li', children: [{ type: 'lc', cid: nanoid(), children: [{ text: '22222' }] }] },
]

// const mockDoc: Doc = {
//   cid: nanoid(),
//   fromDocCid: null,
//   noteCopy: mockNote,
//   noteInput: null,
//   editorValue: templateContent,
//   // value: TreeNode<Bullet>[]
//   // changes: NodeChange<Bullet>[] = []
//   createdAt: date.getDay(),
//   updatedAt: date.getDay(),
//   committedAt: date.getDay(),
//   committedState: null,

//   editorValueLastSaved: templateContent,
//   isEditorValueChangedSinceSave: false,
//   isWebNote: false,
// }

export default {
  title: 'component/Note Head',
  component: NoteHead,
} as ComponentMeta<typeof NoteHead>

const Template: ComponentStory<typeof NoteHead> = args => <NoteHead {...args} />

export const Default = Template.bind({})
