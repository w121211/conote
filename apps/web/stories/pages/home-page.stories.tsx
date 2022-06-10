import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import HomePage from '../../pages/index'
import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from '../../apollo/apollo-client'
import { getApolloClientSSR } from '../../apollo/apollo-client-ssr'

// const apolloClient = getApolloClientSSR()

export default {
  title: 'pages/HomePage',
  component: HomePage,
} as ComponentMeta<typeof HomePage>

export const Template: ComponentStory<typeof HomePage> = args => (
  // <ApolloProvider client={apolloClient}>
  <HomePage {...args} />
  // </ApolloProvider>
)

// export const Default = Template.bind({})
// export const Default = () => {
//   return (
//     <ApolloProvider client={client}>
//       <HomePage />
//     </ApolloProvider>
//   )
// }
