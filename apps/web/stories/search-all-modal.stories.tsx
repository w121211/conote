import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import ModalProvider from '../components/modal/modal-context'
import { SearchAll } from '../components/search-all-modal'

export default {
  component: SearchAll,
  decorators: [
    Story => (
      <div style={{ width: '30%', margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      values: [
        { name: 'dark', value: 'rgb(55 65 81)' },
        { name: 'gray', value: 'rgb(243 244 246)' },
        { name: 'white', value: '#fff' },
      ],
    },
  },
} as ComponentMeta<typeof SearchAll>

const Template: ComponentStory<typeof SearchAll> = _ => (
  <ModalProvider>
    <SearchAll />
  </ModalProvider>
)

export const Default = Template.bind({})
