import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import LoginModal from '../../components/login-modal'
import { MockedProvider } from '@apollo/client/testing'
import { MeDocument } from '../../apollo/query.graphql'
import gql from 'graphql-tag'

export default {
  component: LoginModal,
} as ComponentMeta<typeof LoginModal>

const ME = gql`
  query Me {
    me {
      __typename
      id
    }
  }
`

const mocks = [
  {
    request: {
      query: MeDocument,
    },
    result: {
      data: {
        // __typename: 'User',
        id: 'Foas2chpRbOB2pC3y8WDNJeHdqI3',
      },
    },
  },
]

const Template: ComponentStory<typeof LoginModal> = args => (
  // <MockedProvider mocks={mocks} addTypename={false}>
  <LoginModal {...args}>
    <div>ff</div>
  </LoginModal>
  // </MockedProvider>
)

export const Default = Template.bind({})
// Default.args = {
//   children: <div>ff</div>,
// }

// Default.parameters = {
//   apolloClient: {
//     // do not put MockedProvider here, you can, but its preferred to do it in preview.js
//     mocks: [
//       {
//         request: {
//           query: MeDocument,
//         },
//         result: {
//           data: {
//             __typename: 'User',
//             id: 'Foas2chpRbOB2pC3y8WDNJeHdqI3',
//           },
//         },
//       },
//     ],
//   },
// }
