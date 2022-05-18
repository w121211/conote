import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { DocTemplate } from '../../components/block-editor/src/components/doc/doc-template'
import { mockDocs } from '../../components/block-editor/test/__mocks__/mock-doc'

export default {
  title: 'BlockEditor/DocTemplate',
  component: DocTemplate,
} as ComponentMeta<typeof DocTemplate>

const Template: ComponentStory<typeof DocTemplate> = args => <DocTemplate />

export const Basic = Template.bind({})
Basic.args = {
  doc: mockDocs[1],
}
