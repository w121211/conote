import React, { useState } from 'react'
import { setEntities } from '@ngneat/elf-entities'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { blockRepo } from '../../stores/block.repository'
import { mockBlockStr, mockLocalDoc } from '../../services/mock-data'
import ParseRenderEl from './parse-renderer-el'

/**
 * Setup data
 */
blockRepo.update([setEntities(mockLocalDoc.blocks)])

export default {
  title: 'BlockEditor/parse-renderer',
  component: ParseRenderEl,
} as ComponentMeta<typeof ParseRenderEl>

const Template: ComponentStory<typeof ParseRenderEl> = args => (
  <ParseRenderEl {...args} />
)

export const Basic = Template.bind({})
Basic.args = { str: mockBlockStr.symbolTitle }

// export const WithDocContainerMock = () => (
//   <div className="doc-container">
//     <BlockEl uid="b1" isEditable />
//   </div>
// )

// export const Editing = Template.bind({})
// Editing.args = {
//   label: 'Button',
// }

// export const Selected = Template.bind({})
// Selected.args = {
//   size: 'large',
//   label: 'Button',
// }
