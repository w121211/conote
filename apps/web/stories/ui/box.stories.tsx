import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { Box } from '../../frontend/components/ui-component/box'

export default {
  component: Box,
  decorators: [
    Story => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Box>

const Template: ComponentStory<typeof Box> = args => <Box {...args} />

export const oneItem = Template.bind({})
oneItem.args = {
  children: (
    <div>
      <div>測試</div>
      <div>測試</div>
    </div>
  ),
}
