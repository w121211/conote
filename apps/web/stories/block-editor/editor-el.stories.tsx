import React, { useEffect, useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import ModalProvider from '../../components/modal/modal-context'
import { editorRouteUpdate } from '../../components/block-editor/src/events'
import { getNoteService } from '../../components/block-editor/src/services/note.service'
import { getFirebaseClient } from '../../components/auth/firebase-client'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { getApolloClient } from '../../apollo/apollo-client'
import {
  SessionLoginDocument,
  SessionLoginMutation,
  SessionLoginMutationVariables,
} from '../../apollo/query.graphql'
import { getLoggedInUser } from '../../components/auth/auth.service'
import { getNoteDraftService } from '../../components/block-editor/src/services/note-draft.service'
import { EditorEl } from '../../components/block-editor/src/components/editor/editor-el'
import { EditorToolbar } from '../../components/block-editor/src/components/editor/editor-toolbar'

export default {
  title: 'BlockEditor/EditorEl',
  component: EditorEl,
} as ComponentMeta<typeof EditorEl>

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

// export const MockGotNothing = () => {
//   useEffect(() => {
//     editorRouteUpdate({ mainSymbol: mockGotNothing.title })
//   }, [])
//   return (
//     <ModalProvider>
//       <EditorEl />
//     </ModalProvider>
//   )
// }

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

export const QueryServiceTesting = () => {
  useEffect(() => {
    noteService.queryNote('hello')
    noteDraftService.queryDraft('hello')
  }, [])
  return (
    <div>
      Query graphql...
      <br />
      See Consle for the result
    </div>
  )
}

export const QueryNoteNotExisted = () => {
  useEffect(() => {
    editorRouteUpdate({ mainSymbol: '[[Note not existed]]' })
  }, [])
  return (
    <ModalProvider>
      <EditorEl />
    </ModalProvider>
  )
}

export const QueryNoteAAPL = () => {
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
 * The 'https://storybook.js.org/' draft  is an intentional error data
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

export const Toolbar = () => {
  useEffect(() => {
    editorRouteUpdate({ mainSymbol: '$AAPL' })
  }, [])
  return (
    <ModalProvider>
      <EditorToolbar />
      <EditorEl />
    </ModalProvider>
  )
}
