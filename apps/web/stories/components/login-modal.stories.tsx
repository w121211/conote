import { ComponentStory, ComponentMeta } from '@storybook/react'
import gql from 'graphql-tag'
import { MeDocument } from '../../apollo/query.graphql'
import LoginRequireModal from '../../frontend/components/auth/login-require-modal'

export default {
  component: LoginRequireModal,
} as ComponentMeta<typeof LoginRequireModal>

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

const Template: ComponentStory<typeof LoginRequireModal> = args => (
  // <MockedProvider mocks={mocks} addTypename={false}>
  <LoginRequireModal {...args}>
    <div>ff</div>
  </LoginRequireModal>
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
