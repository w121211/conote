import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { getApolloClient } from '../../apollo/apollo-client'
import DiscussEl from '../../frontend/components/discuss/DiscussEl'
// import { mockDiscusses } from '../../test/__mocks__/mock-discuss'

const apolloClient = getApolloClient()

export default {
  // title: 'layout/Discuss Tile',
  component: DiscussEl,
  decorators: [
    Story => (
      <div style={{ margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof DiscussEl>

const Template: ComponentStory<typeof DiscussEl> = args => (
  <ApolloProvider client={apolloClient}>
    {/* {mockDiscusses.map((e, i) => {
      return <DiscussTile {...args} key={i} data={e} />
    })} */}
  </ApolloProvider>
)

export const Origin = Template.bind({})
