import {
  createContext,
  Provider,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { getApolloClient } from '../../apollo/apollo-client'
import { getLoggedInUser, LoggedInUser } from './auth.service'

/**
 * React hook to get current logged-in user
 *  Check both client and server side, if one side not logged in, does logout for both sides
 */

export function useMe(opts = { refetch: false }): {
  me: LoggedInUser | null
  loading: boolean
} {
  const apolloClient = getApolloClient(),
    [me, setMe] = useState<LoggedInUser | null>(null),
    [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    getLoggedInUser(apolloClient, opts).then(user => {
      setMe(user)
      setLoading(false)
    })
  }, [])

  return { me, loading }
}
