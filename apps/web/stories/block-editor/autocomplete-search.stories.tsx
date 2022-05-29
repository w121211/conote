import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { setEntities } from '@ngneat/elf-entities'
import { ComponentMeta } from '@storybook/react'
import { getApolloClient } from '../../apollo/apollo-client'
import { blockRepo } from '../../components/block-editor/src/stores/block.repository'
import { BlockEl } from '../../components/block-editor/src/components/block/block-el'
import { mockBlocks } from '../../components/block-editor/test/__mocks__/mock-block'
import { TooltipProvider } from '../../layout/tooltip/tooltip-provider'
import { writeBlocks } from '../../components/block-editor/src/utils'
import ModalProvider from '../../components/modal/modal-context'
import { InitStoreForStorybook } from './helper-components/init-store-for-storybook'

// Need to place outside, otherwise the storybook result weird behavior
const basicBlocks = writeBlocks(['a', ['b', 'c']])

const apolloClient = getApolloClient()

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

  return <BlockEl uid={basicBlocks[0].uid} isEditable />
}

export const Demo = () => {
  return (
    <InitStoreForStorybook>
      <ApolloProvider client={apolloClient}>
        <ModalProvider>
          <TooltipProvider>
            <BlockEl uid={mockBlocks[0].uid} isEditable />
          </TooltipProvider>
        </ModalProvider>
      </ApolloProvider>
    </InitStoreForStorybook>
  )
}
