import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import BlocksViewer from '../../frontend/components/editor-textarea/src/components/block/BlocksViewer'
import { writeBlocks } from '../../frontend/components/editor-textarea/src/utils/block-writer'
import { mockBlockInputs } from '../../frontend/components/editor-textarea/test/__mocks__/mock-block'
import { TooltipProvider } from '../../frontend/components/ui/tooltip/tooltip-provider'

export default {
  component: BlocksViewer,
} as ComponentMeta<typeof BlocksViewer>

const Template: ComponentStory<typeof BlocksViewer> = args => (
  <TooltipProvider>
    <div className="max-w-2xl container mx-auto">
      <BlocksViewer {...args} />
    </div>
  </TooltipProvider>
)

export const Base = Template.bind({})
Base.args = {
  blocks: writeBlocks(mockBlockInputs[1]),
}

export const Demo = Template.bind({})
Demo.args = {
  blocks: writeBlocks(mockBlockInputs[0]),
}
