import { ComponentMeta, ComponentStory } from '@storybook/react'
import userEvent from '@testing-library/user-event'
import React, { useState } from 'react'
import TabsWithSlider from '../../frontend/components/ui-component/tabs-with-slider'

export default {
  component: TabsWithSlider,
} as ComponentMeta<typeof TabsWithSlider>

const Template: ComponentStory<typeof TabsWithSlider> = args => {
  const [currentTab, setCurrenTab] = useState('全部')
  return (
    <TabsWithSlider
      {...args}
      handleClickTab={tab => setCurrenTab(tab)}
      currentTab={currentTab}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  tabs: ['全部', '#討論', '#機會', '#Battle', '#事件'],
}
