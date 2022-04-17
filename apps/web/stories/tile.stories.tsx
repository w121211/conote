import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { Tile } from '../layout/tile'

export default {
  title: 'layout/Tile',
  component: Tile,
  decorators: [
    Story => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Tile>

const Template: ComponentStory<typeof Tile> = args => <Tile {...args} />

export const oneItem = Template.bind({})
oneItem.args = {
  children: (
    <div>
      <div>測試</div>
      <div>測試</div>
    </div>
  ),
}
