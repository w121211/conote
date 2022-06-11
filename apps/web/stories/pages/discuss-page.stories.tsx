// import React from 'react'
// import { ApolloProvider } from '@apollo/client'
// import { ComponentMeta, ComponentStory } from '@storybook/react'
// import { getApolloClient } from '../../apollo/apollo-client'
// import DiscussModalPageEl from '../../components/discuss/discuss-modal-page-el'
// import Layout from '../../components/ui-component/layout'

// const apolloClient = getApolloClient()

// export default {
//   title: 'pages/DiscussModalPageEl',
//   component: DiscussModalPageEl,
//   decorators: [
//     Story => (
//       <div>
//         <Story />
//       </div>
//     ),
//   ],
//   parameters: {
//     backgrounds: {
//       values: [
//         { name: 'gray', value: 'rgb(243 244 246)' },
//         { name: 'white', value: '#fff' },
//       ],
//     },
//   },
// } as ComponentMeta<typeof DiscussModalPageEl>

// const Template: ComponentStory<typeof DiscussModalPageEl> = args => {
//   // const paramState = useParameter<string>('backgroundColor')
//   return (
//     <ApolloProvider client={apolloClient}>
//       <Layout>
//         <DiscussModalPageEl {...args} />
//       </Layout>
//     </ApolloProvider>
//   )
// }

// export const Default = Template.bind({})
// Default.args = {
//   id: 'mock_discuss_0_active',
// }
// // Default.parameters = {
// //   backgrounds: {
// //     values: [
// //       { name: 'gray', value: 'rgb(243 244 246)' },
// //       { name: 'white', value: '#fff' },
// //     ],
// //   },
// // }
