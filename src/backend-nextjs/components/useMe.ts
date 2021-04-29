import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { MeQuery, useMeQuery } from '../apollo/query.graphql'
// import useSWR from 'swr'

export default function useMe({
  redirectTo,
  redirectIfFound,
}: {
  redirectTo?: string
  redirectIfFound?: true
}): MeQuery | undefined {
  const { data, loading, error } = useMeQuery()
  const router = useRouter()

  useEffect(() => {
    if (!redirectTo || loading) return
    if ((error && redirectTo && !redirectIfFound) || (redirectIfFound && data?.me)) {
      router.push(redirectTo)
    }
  }, [data, loading, error, redirectIfFound, redirectTo])

  return data
}
