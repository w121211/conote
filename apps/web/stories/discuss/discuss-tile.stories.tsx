import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { getApolloClient } from '../../apollo/apollo-client'
import { DiscussFragment } from '../../apollo/query.graphql'
import { DiscussTile } from '../../components/discuss/discuss-tile'
import { mockDiscusses } from '../../test/__mocks__/mock-discuss'
import { Default } from './post-tile-list.stories'

const apolloClient = getApolloClient()

export default {
  // title: 'layout/Discuss Tile',
  component: DiscussTile,
  decorators: [
    Story => (
      <div style={{ margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof DiscussTile>

const Template: ComponentStory<typeof DiscussTile> = args => (
  <ApolloProvider client={apolloClient}>
    {mockDiscusses.map((e, i) => {
      return <DiscussTile {...args} key={i} data={e} />
    })}
  </ApolloProvider>
)

export const Origin = Template.bind({})
