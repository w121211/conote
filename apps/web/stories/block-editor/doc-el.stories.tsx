import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { setEntities } from '@ngneat/elf-entities'
import { blockRepo } from '../../components/block-editor/src/stores/block.repository'
import { docRepo } from '../../components/block-editor/src/stores/doc.repository'
import { DocEl } from '../../components/block-editor/src/components/doc/doc-el'
import { TooltipProvider } from '../../layout/tooltip/tooltip-provider'
import DomainProvider from '../../components/domain/domain-context'
import { mockBlocks } from '../../components/block-editor/test/__mocks__/mock-block'
import { mockDocs } from '../../components/block-editor/test/__mocks__/mock-doc'
import ModalProvider from '../../components/modal/modal-context'
import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from '../../apollo/apollo-client'

export default {
  title: 'BlockEditor/DocEl',
  component: DocEl,
} as ComponentMeta<typeof DocEl>

const InitStoreForStorybook = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  // useEffect(() => {
  //   blockRepo.clearHistory()
  //   blockRepo.update([setEntities(mockBlocks)])
  //   docRepo.update([setEntities(mockDocs)])
  // }, [])
  blockRepo.clearHistory()
  blockRepo.update([setEntities(mockBlocks)])
  docRepo.update([setEntities(mockDocs)])

  return <>{children}</>
}

const apolloClient = getApolloClient()

const Template: ComponentStory<typeof DocEl> = args => (
  <InitStoreForStorybook>
    <ApolloProvider client={apolloClient}>
      <ModalProvider>
        <TooltipProvider>
          <DomainProvider>
            <DocEl {...args} />
          </DomainProvider>
        </TooltipProvider>
      </ModalProvider>
    </ApolloProvider>
  </InitStoreForStorybook>
)

export const Demo = Template.bind({})
Demo.args = {
  doc: mockDocs[0],
}

export const Empty = Template.bind({})
Empty.args = {
  doc: mockDocs[1],
}
