import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { UserPage } from '../pages/user/[userId]'
import { MeDocument } from '../apollo/query.graphql'

export default {
  title: 'pages/User Page',
  component: UserPage,
} as ComponentMeta<typeof UserPage>

const Template: ComponentStory<typeof UserPage> = () => <UserPage />

export const Default = Template.bind({})

Default.story = {
  parameters: {
    nextRouter: {
      // path: "/profile/[id]",
      // asPath: "/profile/lifeiscontent",
      query: {
        userId: 'fieowjelcij123',
      },
    },
  },
}
// LoggedIn.args = {
//   ...UserPage.args,
// };

// Template.parameters = {
//   apolloClient: {
//     // do not put MockedProvider here, you can, but its preferred to do it in preview.js
//     mocks: [
//       {
//         request: {
//           query: MeDocument,
//         },
//         result: {
//           data: {
//             // __typename:,
//             // id: 'Foas2chpRbOB2pC3y8WDNJeHdqI3',
//           },
//         },
//       },
//     ],
//   },
// }
