import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { DocEl } from '../../components/block-editor/src/components/doc/doc-el'
import { ThemeProvider } from '../../components/theme/theme-provider'
import DomainProvider from '../../components/domain/domain-context'
import { mockDocs } from '../../components/block-editor/test/__mocks__/mock-doc'
import { TooltipProvider } from '../../components/ui-component/tooltip/tooltip-provider'
import { Layout } from '../../components/ui-component/layout'

export default {
  title: 'BlockEditor/DocPage',
  component: DocEl,
} as ComponentMeta<typeof DocEl>

const Template: ComponentStory<typeof DocEl> = args => (
  <ThemeProvider>
    <TooltipProvider>
      <DomainProvider>
        <Layout>
          <DocEl {...args} />
        </Layout>
      </DomainProvider>
    </TooltipProvider>
  </ThemeProvider>
)

export const Basic = Template.bind({})
Basic.args = {
  doc: mockDocs[0],
}
