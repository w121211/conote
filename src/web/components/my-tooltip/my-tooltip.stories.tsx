import React, { useEffect, useRef, useState } from 'react'
import { Story, Meta } from '@storybook/react'
import MyTooltip, { Tooltip } from './my-tooltip'
import classes from './my-tooltip.module.scss'

// interface Tooltip {
//   children: React.ReactNode
//   visible?: boolean
//   handleVisibleState?: (state: boolean) => void
//   width?: number
//   top?: number
//   className?: string
// }

export default {
  component: MyTooltip,
  title: 'MyTooltip',
  argTypes: {
    variant: {
      control: {
        type: 'radio',
        options: ['primary', 'secondary'],
      },
    },

    // Remove the control type
    marginBottom: { control: 'number' }, // Keep it as object

    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<Tooltip> = args => <MyTooltip {...args} />

export const Default = Template.bind({})

Default.args = {
  children: <span>測試</span>,
}
// Default.parameters = {
//   backgrounds: {
//     values: [
//       { name: 'red', value: '#f00' },
//       { name: 'green', value: '#0f0' },
//       { name: 'blue', value: '#00f' },
//     ],
//   },
// }
