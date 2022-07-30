import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

const Button = ({ disable }: { disable: boolean }) => {
  return (
    <button className="btn-normal" disabled={disable}>
      test
    </button>
  )
}

export default {
  component: Button,
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = ({ disable }) => {
  return (
    <div className="flex flex-col w-fit">
      <button disabled={disable}>Button</button>
      <button
        className="px-2 py-1 rounded border border-transparent text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:pointer-events-none"
        disabled={disable}
      >
        Button
      </button>
      <button className="btn-primary" disabled={disable}>
        Button
      </button>
      <button className="btn-secondary" disabled={disable}>
        Button
      </button>
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  disable: false,
}
