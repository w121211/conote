import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { EmojiBtn } from '../../components/emoji/emoji-btn'

export default {
  component: EmojiBtn,
  argTypes: {
    emojiCode: { options: ['UP', 'DOWN'] },
    counts: { control: { type: 'number', min: 1 } },
  },
  decorators: [
    Story => (
      <div style={{ margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof EmojiBtn>

const Template: ComponentStory<typeof EmojiBtn> = args => <EmojiBtn {...args} />

export const WithNumber = Template.bind({})
WithNumber.args = {
  emojiCode: 'UP',
  counts: 10,
  liked: false,
}
