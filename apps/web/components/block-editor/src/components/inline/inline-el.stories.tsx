import React, { useState } from 'react'
import { setEntities } from '@ngneat/elf-entities'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { blockRepo } from '../../stores/block.repository'
import { mockLocalDoc } from '../../services/mock-data'
import InlineEl from './inline-el'

/**
 * Setup data
 */
blockRepo.update([setEntities(mockLocalDoc.blocks)])

export default {
  title: 'BlockEditor/inline-el',
  component: InlineEl,
} as ComponentMeta<typeof InlineEl>

const Template: ComponentStory<typeof InlineEl> = args => <InlineEl {...args} />

export const Discuss = Template.bind({})
Discuss.args = {
  inline: {
    type: 'inline-discuss',
    str: '#hello world#',
    title: 'hello world',
  },
}

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
