import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { HomePage } from '../../pages/index'
import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from '../../apollo/apollo-client'

const apolloClient = getApolloClient()

export default {
  component: HomePage,
} as ComponentMeta<typeof HomePage>

const Template: ComponentStory<typeof HomePage> = () => (
  <ApolloProvider client={apolloClient}>
    <HomePage />
  </ApolloProvider>
)

export const Default = Template.bind({})
