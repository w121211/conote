import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import SidebarEl from '../../frontend/components/editor-textarea/src/components/sidebar/sidebar-el'
import { ThemeProvider } from '../../frontend/components/theme/theme-provider'

export default {
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
