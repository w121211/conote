import { ComponentMeta } from '@storybook/react'
import React from 'react'
import BlocksViewer from '../../frontend/components/editor-textarea/src/components/block/blocks-viewer'
import { mockDocBlock_contentBlocks } from '../../frontend/components/editor-textarea/test/__mocks__/mock-block'

export default {
  component: BlocksViewer,
} as ComponentMeta<typeof BlocksViewer>

// const Template: ComponentStory<typeof BlockEl> = args => <BlockEl {...args} />

// export const Basic = Template.bind({})
// Basic.args = {
//   uid: mockBlocks[0].uid,
//   // uid: mockLocalDoc.blocks[0].uid,
//   isEditable: true,
// }

export const Basic = () => {
  return <BlocksViewer blocks={mockDocBlock_contentBlocks} />
}
