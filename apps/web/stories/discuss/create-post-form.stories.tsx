import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { CreatePostForm } from '../../components/discuss/post/create-post-form'

export default {
  component: CreatePostForm,
  decorators: [
    Story => (
      <div style={{ margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof CreatePostForm>

const Template: ComponentStory<typeof CreatePostForm> = args => <CreatePostForm {...args} />

export const Default = Template.bind({})
Default.args = {
  discussId: '1233',
}
