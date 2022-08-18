import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Sidebar from '../../frontend/components/sidebar/Sidebar'
import { ThemeProvider } from '../../frontend/components/theme/theme-provider'

export default {
  component: Sidebar,
} as ComponentMeta<typeof Sidebar>

const Template: ComponentStory<typeof Sidebar> = args => (
  // <ThemeProvider>
  <Sidebar {...args} />
  // </ThemeProvider>
)

export const Default = Template.bind({})
Default.args = {
  isPined: true,
  showSider: true,
}
