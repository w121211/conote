import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
// import { DiscussPostTile } from '../../components/discuss-post/discuss-post-tile'
import { getApolloClient } from '../../apollo/apollo-client'
import { ApolloProvider } from '@apollo/client'
// import { mockDiscussPosts } from '../../test/__mocks__/mock-discuss'
import { TooltipProvider } from '../../frontend/components/ui/tooltip/tooltip-provider'
import DiscussPostEl from '../../frontend/components/discuss-post/DiscussPostEl'

const apolloClient = getApolloClient()
// const post = mockDiscussPosts

export default {
  component: DiscussPostEl,

  argTypes: {
    className: { table: { disable: true } },
  },
  decorators: [
    Story => (
      <div style={{ margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof DiscussPostEl>

const Template: ComponentStory<typeof DiscussPostEl> = args => {
  return (
    <ApolloProvider client={apolloClient}>
      <TooltipProvider>
        {/* {post.map((e, i) => {
          return <DiscussPostTile {...args} key={i} post={e} />
        })} */}
      </TooltipProvider>
    </ApolloProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  // userId: 'testuser0',
}
