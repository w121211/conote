// import { ComponentMeta, ComponentStory } from '@storybook/react'
// import React from 'react'
// import ModalProvider from '../../frontend/components/modal/modal-context'
// import { ApolloProvider } from '@apollo/client'
// import { getApolloClient } from '../../apollo/apollo-client'
// import NoteHead from '../../frontend/components/note/note-head'
// import { mockNoteDocFragments } from '../../test/__mocks__/note-doc-fragment.mock'

// const apolloClient = getApolloClient()

// export default {
//   title: 'note/NoteHead',
//   component: NoteHead,
// } as ComponentMeta<typeof NoteHead>

// const Template: ComponentStory<typeof NoteHead> = args => (
//   <ApolloProvider client={apolloClient}>
//     <ModalProvider>
//       <NoteHead {...args} />
//     </ModalProvider>
//   </ApolloProvider>
// )

// // export const Symbol = Template.bind({})
// // Symbol.args = {
// //   symbol: '[[Awesome Tailwind CSS]]',
// //   doc: mockNoteDocFragments[0],
// //   isHeadDoc: true,
// // }

// // export const Web = Template.bind({})
// // Web.args = {
// //   symbol: ' mockLink',
// //   isNew: true,
// //   fetchTime: undefined,
// //   link: 'http://www.xxxx.com',
// //   title: 'First Microsoft, then Okta: New ransomware gang posts data from both',
// //   nodeId: '12345',
// // }
// // Web.argTypes = {
// //   title: {
// //     options: [
// //       'First Microsoft, then Okta: New ransomware gang posts data from both',
// //       undefined,
// //     ],
// //   },
// // }
