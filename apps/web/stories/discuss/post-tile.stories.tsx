import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
// import { DiscussPostTile } from '../../components/discuss-post/discuss-post-tile'
import { getApolloClient } from '../../apollo/apollo-client'
import { ApolloProvider } from '@apollo/client'
// import { mockDiscussPosts } from '../../test/__mocks__/mock-discuss'
import { TooltipProvider } from '../../frontend/components/ui-component/tooltip/tooltip-provider'
import DiscussPostTile from '../../frontend/components/discuss-post/discuss-post-tile'

const apolloClient = getApolloClient()
// const post = mockDiscussPosts

export default {
  component: DiscussPostTile,

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
} as ComponentMeta<typeof DiscussPostTile>

const Template: ComponentStory<typeof DiscussPostTile> = args => {
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
