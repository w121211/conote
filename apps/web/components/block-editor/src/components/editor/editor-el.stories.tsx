import React, { useEffect } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { EditorEl } from './editor-el'
import {
  mockGotNothing,
  mockGotNoteOnly,
  mockGotDraftOnly,
  mockGotNoteAndDraft,
} from '../../../test/__mocks__/mock-data'
import ModalProvider from '../../../../modal/modal-context'
import { editorRouteUpdate } from '../../events'
import { blockRepo } from '../../stores/block.repository'
import { setEntities } from '@ngneat/elf-entities'
import { docRepo } from '../../stores/doc.repository'

export default {
  title: 'BlockEditor/EditorEl Route',
  component: EditorEl,
  // decorators: [
  //   Story => {
  //     // Setup data (before each)
  //     useEffect(() => {
  //       blockRepo.clearHistory()
  //       blockRepo.update([setEntities(mockLocalDoc.blocks)])
  //       docRepo.update([setEntities([mockLocalDoc.doc])])
  //     }, [])
  //     return <Story />
  //   },
  // ],
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

export const GotNothing = () => {
  useEffect(() => {
    editorRouteUpdate({ mainSymbol: mockGotNothing.title })
  })
  return (
    <ModalProvider>
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
      <EditorEl />
    </ModalProvider>
  )
}

// export const GotDraftOnly = () => {
//   useEffect(() => {
//     editorRouteUpdate({ mainSymbol: mockGotDraftOnly.title })
//   })
//   return <EditorEl />
// }

// export const GotNoteAndDraft = () => {
//   useEffect(() => {
//     editorRouteUpdate({ mainSymbol: mockGotNoteAndDraft.title })
//   })
//   return <EditorEl />
// }
