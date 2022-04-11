import React, { useEffect } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { EditorEl } from './editor-el'
import {
  mockGotNothing,
  mockGotNoteOnly,
  mockGotDraftOnly,
  mockGotNoteAndDraft,
} from '../../services/mock-data'
import ModalProvider from '../../../../modal/modal-context'
import { editorRouteUpdate } from '../../events'

const mocks = {
    mockGotNothing,
    mockGotNoteOnly,
    mockGotDraftOnly,
    mockGotNoteAndDraft,
  },
  mockRouteArgs = Object.fromEntries(
    Object.entries(mocks).map(([k, v]) => [k, { symbol: v.title }]),
  )

export default {
  title: 'BlockEditor/EditorEl Route',
  component: EditorEl,
  // argTypes: {
  //   route: {
  //     options: Object.keys(mockRouteArgs),
  //     mapping: mockRouteArgs,
  //   },
  // },
} as ComponentMeta<typeof EditorEl>

// const Template: ComponentStory<typeof EditorEl> = args => <EditorEl {...args} />

// export const GotNothing = Template.bind({})
// GotNothing.args = {
//   route: { symbol: mockGotNothing.title },
// }

// export const GotNoteOnly = Template.bind({})
// GotNoteOnly.args = {
//   route: { symbol: mockGotNoteOnly.title },
// }

// export const GotDraftOnly = Template.bind({})
// GotDraftOnly.args = {
//   route: { symbol: mockGotDraftOnly.title },
// }

// export const GotNoteAndDraft = Template.bind({})
// GotNoteAndDraft.args = {
//   route: { symbol: mockGotNoteAndDraft.title },
// }

// export const ModalSymbol = () => {
//   const route = {
//     symbol: mockGotNoteAndDraft.title,
//     modal: { symbol: mockGotDraftOnly.title },
//   }
//   return (
//     <ModalProvider>
//       <EditorEl route={route} />
//     </ModalProvider>
//   )
// }

// export const ModalDiscuss = Template.bind({})
// ModalDiscuss.args = {
//   route: {
//     symbol: mockGotNoteAndDraft.title,
//     modal: { discussId: 'discussId' },
//   },
// }

const updateRouteButtons = (
  <>
    <button
      onClick={() => editorRouteUpdate({ mainSymbol: mockGotNoteOnly.title })}
    >
      update-main-symbol
    </button>
    <button
      onClick={() =>
        editorRouteUpdate({ modalSymbol: mockGotNoteAndDraft.title })
      }
    >
      add-modal-symbol
    </button>
    <button onClick={() => editorRouteUpdate({ modalSymbol: null })}>
      remove-modal-symbol
    </button>
  </>
)

export const GotNothing = () => {
  useEffect(() => {
    editorRouteUpdate({ mainSymbol: mockGotNothing.title })
  })
  return (
    <ModalProvider>
      {updateRouteButtons}
      <EditorEl />
    </ModalProvider>
  )
}

export const GotNoteOnly = () => {
  useEffect(() => {
    editorRouteUpdate({ mainSymbol: mockGotNoteOnly.title })
  })
  return (
    <ModalProvider>
      {updateRouteButtons}
      <EditorEl />
    </ModalProvider>
  )
}

export const GotDraftOnly = () => {
  useEffect(() => {
    editorRouteUpdate({ mainSymbol: mockGotDraftOnly.title })
  })
  return <EditorEl />
}

export const GotNoteAndDraft = () => {
  useEffect(() => {
    editorRouteUpdate({ mainSymbol: mockGotNoteAndDraft.title })
  })
  return <EditorEl />
}
