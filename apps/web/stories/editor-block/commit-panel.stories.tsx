import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CommitPanel } from '../../frontend/components/editor-textarea/src/components/commit/commit-panel'

export default {
  title: 'BlockEditor/CommitPanel',
  component: CommitPanel,
} as ComponentMeta<typeof CommitPanel>

const Template: ComponentStory<typeof CommitPanel> = args => (
  // <CommitPanel {...args} />
  <CommitPanel />
)

export const Basic = Template.bind({})
// Basic.args = {
//   uid: mockBlocks[0].uid,
//   // uid: mockLocalDoc.blocks[0].uid,
//   isEditable: true,
// }
