import React, { useEffect, useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { mockGotNothing } from '../../../test/__mocks__/mock-data'
import ModalProvider from '../../../../modal/modal-context'
import { editorRouteUpdate } from '../../events'
import { getNoteService } from '../../services/note.service'
import { getFirebaseClient } from '../../../../auth/firebase-client'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { getApolloClient } from '../../../../../apollo/apollo-client'
import {
  SessionLoginDocument,
  SessionLoginMutation,
  SessionLoginMutationVariables,
} from '../../../../../apollo/query.graphql'
import { getLoggedInUser } from '../../../../auth/auth.service'
import { getNoteDraftService } from '../../services/note-draft.service'
import { EditorEl } from './editor-el'

export default {
  title: 'BlockEditor/EditorEl',
  component: EditorEl,
  // decorators: [
  //   Story => {
  //     // Setup data (before each)
  //     useEffect(() => {
  //       blockRepo.clearHistory()
  //       blockRepo.update([setEntities(mockLocalDoc.blocks)])
  //       docRepo.update([setEntities([mockLocalDoc.doc])])
  //     }, [])
  //     return <Story />
  //   },
  // ],
} as ComponentMeta<typeof EditorEl>

// const Template: ComponentStory<typeof EditorEl> = args => <EditorEl {...args} />

// export const GotNothing = Template.bind({})
// GotNothing.args = {
//   route: { symbol: mockGotNothing.title },
// }

// export const GotNoteOnly = Template.bind({})
// GotNoteOnly.args = {
//   route: { symbol: mockGotNoteOnly.title },
// }

// export const GotDraftOnly = Template.bind({})
// GotDraftOnly.args = {
//   route: { symbol: mockGotDraftOnly.title },
// }

// export const GotNoteAndDraft = Template.bind({})
// GotNoteAndDraft.args = {
//   route: { symbol: mockGotNoteAndDraft.title },
// }

// export const ModalSymbol = () => {
//   const route = {
//     symbol: mockGotNoteAndDraft.title,
//     modal: { symbol: mockGotDraftOnly.title },
//   }
//   return (
//     <ModalProvider>
//       <EditorEl route={route} />
//     </ModalProvider>
//   )
// }

// export const ModalDiscuss = Template.bind({})
// ModalDiscuss.args = {
//   route: {
//     symbol: mockGotNoteAndDraft.title,
//     modal: { discussId: 'discussId' },
//   },
// }

const noteService = getNoteService(),
  noteDraftService = getNoteDraftService()

const apolloClient = getApolloClient(),
  firebaseClient = getFirebaseClient(),
  auth = getAuth(firebaseClient)

async function testUserSignUp() {
  const userCredential = await createUserWithEmailAndPassword(
      auth,
      'user@example.com',
      'password',
    ),
    idToken = await userCredential.user.getIdToken()

  try {
    await apolloClient.resetStore()
    const { data } = await apolloClient.mutate<
      SessionLoginMutation,
      SessionLoginMutationVariables
    >({
      mutation: SessionLoginDocument,
      variables: { idToken },
    })

    if (data?.sessionLogin) {
      location.reload()
    } else {
      console.error('session login fail')
    }
  } catch (err) {
    console.debug(err)
  }
}

async function testUserSignIn() {
  const user = await getLoggedInUser(apolloClient)

  if (user) {
    console.log('test user already signed in')
    return user
  }

  const userCredential = await signInWithEmailAndPassword(
      auth,
      'user@example.com',
      'password',
    ),
    idToken = await userCredential.user.getIdToken()

  try {
    await apolloClient.resetStore()
    const { data } = await apolloClient.mutate<
      SessionLoginMutation,
      SessionLoginMutationVariables
    >({
      mutation: SessionLoginDocument,
      variables: { idToken },
    })

    console.log(data)
    // if (data?.sessionLogin) {
    //   location.reload()
    // } else {
    //   console.error('session login fail')
    // }
  } catch (err) {
    console.debug(err)
  }
}

export const GraphqlTest = () => {
  useEffect(() => {
    // noteService.queryNote('hello')
    noteDraftService.queryDraft('hello')
  }, [])
  return <div>Hello world</div>
}

export const MockGotNothing = () => {
  useEffect(() => {
    editorRouteUpdate({ mainSymbol: mockGotNothing.title })
  }, [])

  return (
    <ModalProvider>
      <EditorEl />
    </ModalProvider>
  )
}

export const QueryAAPL = () => {
  useEffect(() => {
    editorRouteUpdate({ mainSymbol: '$AAPL' })
  }, [])
  return (
    <ModalProvider>
      <EditorEl />
    </ModalProvider>
  )
}

/**
 * Mock-draft 'https://storybook.js.org/' is an intentional error data
 */
export const HandleError = () => {
  const [error, setError] = useState(false)

  useEffect(() => {
    editorRouteUpdate({ mainSymbol: 'https://storybook.js.org/' }).catch(
      err => {
        console.error(err)
        setError(true)
      },
    )
  }, [])

  if (error) {
    return <div>Error!</div>
  }
  return (
    <ModalProvider>
      <EditorEl />
    </ModalProvider>
  )
}

// export const GotNoteOnly = () => {
//   useEffect(() => {
//     editorRouteUpdate({ mainSymbol: mockGotNoteOnly.title })
//   })

//   return (
//     <ModalProvider>
//       <EditorEl />
//     </ModalProvider>
//   )
// }

// export const GotDraftOnly = () => {
//   useEffect(() => {
//     editorRouteUpdate({ mainSymbol: mockGotDraftOnly.title })
//   })
//   return <EditorEl />
// }

// export const GotNoteAndDraft = () => {
//   useEffect(() => {
//     editorRouteUpdate({ mainSymbol: mockGotNoteAndDraft.title })
//   })
//   return <EditorEl />
// }
