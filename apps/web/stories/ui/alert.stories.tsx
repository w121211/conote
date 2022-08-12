import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState } from 'react'
import { Alert } from '../../frontend/components/ui/alert'

export default {
  component: Alert,
} as ComponentMeta<typeof Alert>

const Template: ComponentStory<typeof Alert> = args => {
  return (
    <div className="flex flex-col gap-2">
      <Alert
        {...args}
        type="warning"
        action="merge"
        str="warning"
        time="(5 hours ago)"
      />
      <Alert
        {...args}
        type="error"
        action="merge"
        str="error"
        time="(5 hours ago)"
      />
      <Alert
        {...args}
        type="success"
        action="merge"
        str="success"
        time="(5 hours ago)"
      />
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  visible: true,
}
