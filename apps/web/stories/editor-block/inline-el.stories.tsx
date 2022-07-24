import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import InlineEl from '../../frontend/components/editor-textarea/src/components/inline/inline-el'

/**
 * Setup data
 */
// blockRepo.update([setEntities(mockLocalDoc.blocks)])

export default {
  title: 'BlockEditor/InlineEl',
  component: InlineEl,
} as ComponentMeta<typeof InlineEl>

const Template: ComponentStory<typeof InlineEl> = args => <InlineEl {...args} />

// export const Discuss = Template.bind({})
// Discuss.args = {
//   inline: {
//     type: 'inline-discuss',
//     str: '#hello world#',
//     title: 'hello world',
//   },
// }

// export const WithDocContainerMock = () => (
//   <div className="doc-container">
//     <BlockEl uid="b1" isEditable />
//   </div>
// )

// export const Editing = Template.bind({})
// Editing.args = {
//   label: 'Button',
// }

// export const Selected = Template.bind({})
// Selected.args = {
//   size: 'large',
//   label: 'Button',
// }
