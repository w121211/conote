import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import SideBar from '../../components/sidebar/sidebar'
import { ThemeProvider } from '../../components/theme/theme-provider'

export default {
  title: 'component/SideBar',
  component: SideBar,
} as ComponentMeta<typeof SideBar>

const Template: ComponentStory<typeof SideBar> = args => (
  <ThemeProvider>
    <SideBar {...args} />
  </ThemeProvider>
)

export const Default = Template.bind({})
Default.args = {
  isPined: true,
  showSider: true,
}
