import { createContext, ReactNode, useContext } from 'react'
import { LoggedInUser } from './auth.service'
import { useMe } from './use-me'

type MeContextValue = {
  me: LoggedInUser | null | undefined
  loading: boolean | undefined
}

const Context = createContext<MeContextValue>({
  me: undefined,
  loading: undefined,
})

export function useMeContext() {
  const { me, loading } = useContext(Context)
  if (me === undefined || loading === undefined) {
    throw new Error('Out of "MeProvider"')
  }
  return { me, loading }
}

export const MeProvider = ({ children }: { children: ReactNode }) => {
  const { Provider } = Context
  const { me, loading } = useMe()
  return <Provider value={{ me, loading }}>{children}</Provider>
}
