import { FirebaseApp } from '@firebase/app'
import { createContext, useContext, Context } from 'react'
import { useFirebase } from './firebase-app'

const FirebaseContext = createContext<FirebaseApp | null>(null)

export const FirebaseProvider = ({
  children,
}: {
  children: JSX.Element
}): JSX.Element => {
  const firebase = useFirebase()
  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  )
}

export const useFirebaseClient = (): FirebaseApp | null =>
  useContext(FirebaseContext)
