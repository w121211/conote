import { useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  MeQuery,
  useMeQuery,
  // useMyBoardLikesQuery,
  // useMyBulletLikesLazyQuery,
  // useMyCommentLikesQuery,
  useMyVotesQuery,
} from '../apollo/query.graphql'
// import useSWR from 'swr'

export function useMe({
  redirectTo,
  redirectIfFound,
}: {
  redirectTo?: string
  redirectIfFound?: true
}): MeQuery | undefined {
  const { data, loading, error } = useMeQuery()
  const router = useRouter()

  // 從server取得me相關的資料，用於填充cache <- TODO: a better solution?
  // useMyBulletLikesLazyQuery()
  // useMyBoardLikesQuery()
  // useMyCommentLikesQuery()
  // useMyVotesQuery()

  useEffect(() => {
    if (!redirectTo || loading) return
    if ((error && redirectTo && !redirectIfFound) || (redirectIfFound && data?.me)) {
      router.push(redirectTo)
    }
  }, [data, loading, error, redirectIfFound, redirectTo])

  return data
}
