import React, { useEffect } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { setEntities } from '@ngneat/elf-entities'
import { mockLocalDoc } from '../../../test/__mocks__/mock-data'
import { blockRepo } from '../../stores/block.repository'
import { docRepo } from '../../stores/doc.repository'
import { DocEl } from './doc-el'
import { TooltipProvider } from '../../../../../layout/tooltip/tooltip-provider'
import DomainProvider from '../../../../domain/domain-context'
import { Layout } from '../../../../../layout/layout'

export default {
  title: 'BlockEditor/DocPage',
  component: DocEl,
  decorators: [
    Story => {
      // Setup data (before each)
      useEffect(() => {
        blockRepo.clearHistory()
        blockRepo.update([setEntities(mockLocalDoc.blocks)])
        docRepo.update([setEntities([mockLocalDoc.doc])])
      }, [])

      return <Story />
    },
  ],
} as ComponentMeta<typeof DocEl>

const Template: ComponentStory<typeof DocEl> = args => (
  <TooltipProvider>
    <DomainProvider>
      <Layout>
        <DocEl {...args} />
      </Layout>
    </DomainProvider>
  </TooltipProvider>
)

export const Basic = Template.bind({})
Basic.args = {
  doc: mockLocalDoc.doc,
}
