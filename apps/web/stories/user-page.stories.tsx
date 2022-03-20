import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import UserPage from '../pages/user/[userId]'
import { MeDocument } from '../apollo/query.graphql'

// export default {
//   title: 'UserPage',
//   component: UserPage,
// } as ComponentMeta<typeof UserPage>

// export const Template: ComponentStory<typeof UserPage> = args => <UserPage {...args} />

// export const Default = Template.bind({})
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
