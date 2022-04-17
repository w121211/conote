import React from 'react'
import { setEntities } from '@ngneat/elf-entities'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { blockRepo } from '../../stores/block.repository'
import { BlockEl } from './block-el'
import { mockLocalDoc } from '../../../test/__mocks__/mock-data'
import { mockBlocks } from '../../../../../test/__mocks__/mock-block'

/**
 * Setup data
 */
blockRepo.update([setEntities(mockBlocks)])
// blockRepo.update([setEntities(mockLocalDoc.blocks)])

export default {
  title: 'BlockEditor/BlockEl',
  component: BlockEl,
} as ComponentMeta<typeof BlockEl>

const Template: ComponentStory<typeof BlockEl> = args => <BlockEl {...args} />

export const Basic = Template.bind({})
Basic.args = {
  uid: mockBlocks[0].uid,
  // uid: mockLocalDoc.blocks[0].uid,
  isEditable: true,
}

// export const WithDocContainer = () => (
//   <div className="doc-container">
//     <BlockEl uid={mockBlocks[0].uid} isEditable />
//   </div>
// )
