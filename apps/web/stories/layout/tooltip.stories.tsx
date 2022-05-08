import React, { useEffect, useRef, useState } from 'react'
import { Story, Meta, ComponentMeta, ComponentStory } from '@storybook/react'
import { Tooltip } from '../../layout/tooltip/tooltip'
// import classes from './my-tooltip.module.scss'
import { TooltipProvider } from '../../layout/tooltip/tooltip-provider'

// interface Tooltip {
//   children: React.ReactNode
//   visible?: boolean
//   handleVisibleState?: (state: boolean) => void
//   width?: number
//   top?: number
//   className?: string
// }

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
  const [open, setOpen] = useState(false)
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
  state: undefined,
  // warn:false
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
