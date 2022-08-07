import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { DocEl } from '../../frontend/components/editor-textarea/src/components/doc/doc-el'
import DomainProvider from '../../frontend/components/domain/domain-context'
import { mockDocs } from '../../frontend/components/editor-textarea/test/__mocks__/mock-doc'
import ModalProvider from '../../frontend/components/modal/modal-context'
import { getApolloClient } from '../../apollo/apollo-client'
import { InitStoreForStorybook } from './helper-components/init-store-for-storybook'
import { TooltipProvider } from '../../frontend/components/ui-component/tooltip/tooltip-provider'

export default {
  component: DocEl,
} as ComponentMeta<typeof DocEl>

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
