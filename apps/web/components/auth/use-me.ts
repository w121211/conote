import { useApolloClient } from '@apollo/client'
import { useEffect, useState } from 'react'
import { getLoggedInUser, LoggedInUser } from './auth.service'

/**
 * React hook to get current logged-in user
 *
 * Check both client and server side, if one side not logged in, does logout for both sides
 */
export function useMe(): {
  me: LoggedInUser | null
  loading: boolean
} {
  const apolloClient = useApolloClient(),
    [me, setMe] = useState<LoggedInUser | null>(null),
    [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    getLoggedInUser(apolloClient).then(user => {
      setMe(user)
      setLoading(false)
    })
  }, [])

  return { me, loading }
}
