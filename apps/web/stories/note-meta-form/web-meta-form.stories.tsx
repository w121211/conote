import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { WebMetaForm } from '../../components/note/note-meta-form/web-meta-topic'

export default {
  component: WebMetaForm,
  decorators: [
    Story => (
      <div style={{ margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof WebMetaForm>

const Template: ComponentStory<typeof WebMetaForm> = args => (
  <WebMetaForm {...args} />
)

export const Default = Template.bind({})
Default.args = {}
