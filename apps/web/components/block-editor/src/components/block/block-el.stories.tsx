import React, { useState } from 'react'
import { setEntities } from '@ngneat/elf-entities'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { blockRepo } from '../../stores/block.repository'
import { BlockEl } from './block-el'
import { mockLocalDoc } from '../../services/mock-data'

/**
 * Setup data
 */
blockRepo.update([setEntities(mockLocalDoc.blocks)])

export default {
  title: 'BlockEditor/BlockEl',
  component: BlockEl,
} as ComponentMeta<typeof BlockEl>

const Template: ComponentStory<typeof BlockEl> = args => <BlockEl {...args} />

export const Basic = Template.bind({})
Basic.args = {
  uid: mockLocalDoc.blocks[0].uid,
  isEditable: true,
}

export const WithDocContainerMock = () => (
  <div className="doc-container">
    <BlockEl uid="b1" isEditable />
  </div>
)

// export const Editing = Template.bind({})
// Editing.args = {
//   label: 'Button',
// }

// export const Selected = Template.bind({})
// Selected.args = {
//   size: 'large',
//   label: 'Button',
// }
