import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { getApolloClient } from '../../apollo/apollo-client'
import ModalProvider from '../../components/modal/modal-context'
import { ThemeProvider } from '../../components/theme/theme-provider'
import Layout from '../../components/ui-component/layout'

const apolloClient = getApolloClient()

export default {
  component: Layout,
} as ComponentMeta<typeof Layout>

const Template: ComponentStory<typeof Layout> = args => (
  <ApolloProvider client={apolloClient}>
    <ModalProvider>
      <ThemeProvider>
        <Layout {...args} />
      </ThemeProvider>
    </ModalProvider>
  </ApolloProvider>
)

export const Default = Template.bind({})
Default.args = {
  children: (
    <div>
      asdfasdf aj;sdlkfj;alksjd;lkfj aj;sdlkfj;alskjd;lfk ajs;dlkfj;alksjd;lkfj;
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      ja;slkdjf;lakjs;ldk ja;sldkfj;a lksjd;flkaj asjdf;lakjsd
      asdjf;laksjd;lfkj;alskdj;flkj jas;dlkjfojwoiejfoiwje ofj jfwoiejfoiwjeof
      jwjdijf sjdofjosijofij
    </div>
  ),
}
