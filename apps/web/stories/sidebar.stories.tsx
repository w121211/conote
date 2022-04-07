import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import SideBar from '../components/sidebar/sidebar'

export default {
  title: 'component/SideBar',
  component: SideBar,
} as ComponentMeta<typeof SideBar>

const Template: ComponentStory<typeof SideBar> = args => <SideBar {...args} />

export const Default = Template.bind({})
Default.args = {
  isPined: true,
  showSider: true,
}
