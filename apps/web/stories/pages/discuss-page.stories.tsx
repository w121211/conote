import React from 'react'
import { DiscussPageComponent } from '../../components/discuss/discuss-page'
import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { getApolloClient } from '../../apollo/apollo-client'
import DiscussPageEl from '../../components/discuss/discuss-page-el'
import Layout from '../../layout/layout'
import { Layout } from '../../components/ui-component/layout'

const apolloClient = getApolloClient()

export default {
  // title: 'pages/Discss Full Page',
  component: DiscussPageEl,
  decorators: [
    Story => (
      <div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      values: [
        { name: 'gray', value: 'rgb(243 244 246)' },
        { name: 'white', value: '#fff' },
      ],
    },
  },
} as ComponentMeta<typeof DiscussPageEl>

const Template: ComponentStory<typeof DiscussPageEl> = args => {
  // const paramState = useParameter<string>('backgroundColor')
  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <DiscussPageEl {...args} />
      </Layout>
    </ApolloProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  id: 'mock_discuss_0_active',
}
// Default.parameters = {
//   backgrounds: {
//     values: [
//       { name: 'gray', value: 'rgb(243 244 246)' },
//       { name: 'white', value: '#fff' },
//     ],
//   },
// }
