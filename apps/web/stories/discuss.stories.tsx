import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import LoginModal from '../components/login-modal'
import { MockedProvider } from '@apollo/client/testing'
import { DiscussQuery } from '../apollo/query.graphql'
import gql from 'graphql-tag'
import DiscussFullPage from '../components/discuss/discuss-page'

export default {
  title: 'DiscussFullPage',
  component: DiscussFullPage,
} as ComponentMeta<typeof DiscussFullPage>

const ME = gql`
  query Me {
    me {
      __typename
      id
    }
  }
`

const Template = args => <DiscussFullPage {...args} />

export const Renders = Template.bind({})

Renders.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: DiscussQuery,
          variables: {},
        },
        result: {
          data: {
            id: 'ID',
            userId: 'String!',
            status: 'hello!',
            meta: {},
            title: 'title',
            content: 'content',
            createdAt: new Date(2020, 1, 1),
            updatedAt: new Date(2020, 1, 1),
            count: {
              id: 'ID',
              nPosts: 10,
            },
          },
        },
      },
    ],
  },
  //   nextRouter: {
  //     pathname: '/editor',
  //     asPath: '/editor',
  //   },
}
