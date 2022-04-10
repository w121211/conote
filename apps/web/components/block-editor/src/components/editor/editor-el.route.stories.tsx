import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { EditorEl } from './editor-el'
import {
  mockGotNothing,
  mockGotNoteOnly,
  mockGotDraftOnly,
  mockGotNoteAndDraft,
} from '../../services/mock-data'

const mocks = {
    mockGotNothing,
    mockGotNoteOnly,
    mockGotDraftOnly,
    mockGotNoteAndDraft,
  },
  mockRouteArgs = Object.fromEntries(
    Object.entries(mocks).map(([k, v]) => [k, { symbol: v.title }]),
  )

export default {
  title: 'BlockEditor/EditorEl Route',
  component: EditorEl,
  argTypes: {
    route: {
      options: Object.keys(mockRouteArgs),
      mapping: mockRouteArgs,
    },
  },
} as ComponentMeta<typeof EditorEl>

const Template: ComponentStory<typeof EditorEl> = args => <EditorEl {...args} />

export const GotNothing = Template.bind({})
GotNothing.args = {
  route: { symbol: mockGotNothing.title },
}

export const GotNoteOnly = Template.bind({})
GotNoteOnly.args = {
  route: { symbol: mockGotNoteOnly.title },
}

export const GotDraftOnly = Template.bind({})
GotDraftOnly.args = {
  route: { symbol: mockGotDraftOnly.title },
}

export const GotNoteAndDraft = Template.bind({})
GotNoteAndDraft.args = {
  route: { symbol: mockGotNoteAndDraft.title },
}
