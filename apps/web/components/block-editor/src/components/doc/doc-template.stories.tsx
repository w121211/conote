import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { setEntities } from '@ngneat/elf-entities'
import { mockLocalDoc } from '../../../test/__mocks__/mock-data'
import { blockRepo } from '../../stores/block.repository'
import { docRepo } from '../../stores/doc.repository'
import { DocTemplate } from './doc-template'

export default {
  title: 'BlockEditor/DocTemplate',
  component: DocTemplate,
} as ComponentMeta<typeof DocTemplate>

const Template: ComponentStory<typeof DocTemplate> = args => <DocTemplate />

export const Basic = Template.bind({})
Basic.args = {
  doc: mockLocalDoc.doc,
}
