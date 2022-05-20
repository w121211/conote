import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { DiscussPageComponent } from '../../components/discuss/discuss-page'
import { Layout } from '../../layout/layout'
import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from '../../apollo/apollo-client'

const apolloClient = getApolloClient()

export default {
  // title: 'pages/Discss Full Page',
  component: DiscussPageComponent,
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
} as ComponentMeta<typeof DiscussPageComponent>

const Template: ComponentStory<typeof DiscussPageComponent> = args => {
  // const paramState = useParameter<string>('backgroundColor')
  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <DiscussPageComponent {...args} />
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
