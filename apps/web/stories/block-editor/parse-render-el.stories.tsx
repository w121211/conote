import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import ParseRenderEl from '../../components/block-editor/src/components/inline/parse-render-el'
import { mockBlockStr } from '../../components/block-editor/test/__mocks__/mock-block-str'

export default {
  title: 'BlockEditor/ParseRenderEl',
  component: ParseRenderEl,
} as ComponentMeta<typeof ParseRenderEl>

const Template: ComponentStory<typeof ParseRenderEl> = args => (
  <ParseRenderEl {...args} />
)

export const Basic = Template.bind({})
Basic.args = { str: mockBlockStr.symbolTitle }

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
