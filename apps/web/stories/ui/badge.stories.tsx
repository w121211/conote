import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { Badge } from '../../frontend/components/ui-component/badge'

export default {
  component: Badge,
} as ComponentMeta<typeof Badge>

const Template: ComponentStory<typeof Badge> = args => {
  return <Badge {...args} />
}

export const Default = Template.bind({})
Default.args = {
  content: 'test',
}
export const New = Template.bind({})
New.args = {
  content: 'new',
  bgClassName: 'bg-yellow-200/60',
  textClassName: 'font-bold text-xl',
}
