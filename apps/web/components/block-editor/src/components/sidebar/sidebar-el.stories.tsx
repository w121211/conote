import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import SidebarEl from './sidebar-el'

export default {
  title: 'BlockEditor/SidebarEl',
  component: SidebarEl,
} as ComponentMeta<typeof SidebarEl>

const Template: ComponentStory<typeof SidebarEl> = args => (
  <SidebarEl {...args} />
)

export const Default = Template.bind({})
Default.args = {
  isPined: true,
  showSider: true,
}
