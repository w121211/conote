import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import SidebarEl from '../../frontend/components/block-editor/src/components/sidebar/sidebar-el'
import { ThemeProvider } from '../../frontend/components/theme/theme-provider'

export default {
  title: 'BlockEditor/SidebarEl',
  component: SidebarEl,
} as ComponentMeta<typeof SidebarEl>

const Template: ComponentStory<typeof SidebarEl> = args => (
  // <ThemeProvider>
  <SidebarEl {...args} />
  // </ThemeProvider>
)

export const Default = Template.bind({})
Default.args = {
  isPined: true,
  showSider: true,
}
