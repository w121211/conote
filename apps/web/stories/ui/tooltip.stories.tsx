import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Tooltip } from '../../frontend/components/ui/tooltip/tooltip'
import { TooltipProvider } from '../../frontend/components/ui/tooltip/tooltip-provider'

export default {
  component: Tooltip,
  argTypes: {
    size: {
      control: {
        options: ['sm', 'md'],
      },
    },
    state: {
      control: {
        options: [undefined, 'warn'],
      },
    },
  },
  decorators: [
    Story => (
      <div style={{ margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Tooltip>

const Template: ComponentStory<typeof Tooltip> = args => {
  return (
    <TooltipProvider>
      <Tooltip
        {...args}
        // visible={open}
        // onClose={() => {
        //   setOpen(false)
        // }}
      >
        test
        {/* <span
          className="border border-blue-400"
          onMouseEnter={() => {
            setOpen(true)
          }}
          onMouseLeave={() => {
            setOpen(false)
          }}
        >
          test
        </span> */}
      </Tooltip>
    </TooltipProvider>
  )
}

export const Default = Template.bind({})

Default.args = {
  visible: true,
  title: 'test',
  size: 'sm',
  type: undefined,
  // warn:false
}
