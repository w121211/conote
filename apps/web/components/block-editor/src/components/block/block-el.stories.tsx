import React, { useEffect } from 'react'
import { setEntities } from '@ngneat/elf-entities'
import { ComponentMeta } from '@storybook/react'
import { blockRepo } from '../../stores/block.repository'
import { BlockEl } from './block-el'
import { mockBlocks } from '../../../test/__mocks__/mock-block'
import { TooltipProvider } from '../../../../../layout/tooltip/tooltip-provider'
import { writeBlocks } from '../../utils'

// Need to place outside, otherwise the storybook result weird behavior
const basicBlocks = writeBlocks(['a', ['b', 'c']])

export default {
  title: 'BlockEditor/BlockEl',
  component: BlockEl,
} as ComponentMeta<typeof BlockEl>

// const Template: ComponentStory<typeof BlockEl> = args => <BlockEl {...args} />

// export const Basic = Template.bind({})
// Basic.args = {
//   uid: mockBlocks[0].uid,
//   // uid: mockLocalDoc.blocks[0].uid,
//   isEditable: true,
// }

export const Basic = () => {
  blockRepo.clearHistory()
  blockRepo.update([setEntities(basicBlocks)])

  return (
    // <TooltipProvider>
    <BlockEl uid={basicBlocks[0].uid} isEditable />
    // </TooltipProvider>
  )
}

export const Demo = () => {
  // (BUG) useEffect throws error, possibly caused by storybook
  // useEffect(() => {
  //   blockRepo.clearHistory()
  //   blockRepo.update([setEntities(mockBlocks)])
  // }, [])

  blockRepo.clearHistory()
  blockRepo.update([setEntities(mockBlocks)])

  return (
    <TooltipProvider>
      <BlockEl uid={mockBlocks[0].uid} isEditable />
    </TooltipProvider>
  )
}

export const Textarea = () => {
  const value = '012345678\n012345678\n012345678\n'
  return (
    <textarea
      rows={4}
      value={value}
      onKeyUp={e => {
        const { currentTarget, target } = e
        const t = target as HTMLTextAreaElement
        console.log(
          'keyup',
          currentTarget.selectionStart,
          currentTarget.selectionDirection,
        )
      }}
      onKeyDown={e => {
        const { currentTarget, target } = e
        const t = target as HTMLTextAreaElement
        console.log(
          'keydown',
          currentTarget.selectionStart,
          currentTarget.selectionDirection,
        )
      }}
    ></textarea>
  )
}
