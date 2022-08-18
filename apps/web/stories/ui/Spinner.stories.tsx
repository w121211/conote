import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import Spinner from '../../frontend/components/ui/Spinner'

export default {
  component: Spinner,
  // argTypes: {
  //   size: {
  //     control: {
  //       options: ['sm', 'md'],
  //     },
  //   },
  //   state: {
  //     control: {
  //       options: [undefined, 'warn'],
  //     },
  //   },
  // },
  // decorators: [
  //   Story => (
  //     <div style={{ margin: '3rem' }}>
  //       <Story />
  //     </div>
  //   ),
  // ],
} as ComponentMeta<typeof Spinner>

const Template: ComponentStory<typeof Spinner> = args => {
  return <Spinner />
}

export const Base = Template.bind({})
