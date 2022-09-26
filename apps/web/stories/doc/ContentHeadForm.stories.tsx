import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import ContentHeadForm from '../../frontend/components/editor-textarea/src/components/doc/ContentHeadForm'
import { mockDocs } from '../../frontend/components/editor-textarea/test/__mocks__/mock-doc'

export default {
  component: ContentHeadForm,
} as ComponentMeta<typeof ContentHeadForm>

const Template: ComponentStory<typeof ContentHeadForm> = args => (
  <div className="max-w-2xl container mx-auto">
    {/* <Form /> */}
    <ContentHeadForm {...args} />
  </div>
)

export const Base = Template.bind({})
Base.args = {
  doc: mockDocs[0],
  onFinish: () => {
    // Do nothing
  },
}

export const Webnote = Template.bind({})
Webnote.args = {
  doc: mockDocs[4],
  onFinish: () => {
    // Do nothing
  },
}
