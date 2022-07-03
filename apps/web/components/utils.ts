import { ApolloError } from '@apollo/client'
import type { NextRouter } from 'next/router'
import { UrlObject } from 'url'
import type { CommitInputErrorItem } from '../lib/interfaces'

/**
 * TODO
 * - [] When SSR, not able to provide a redirect back url
 */
export function getLoginPageURL(router?: NextRouter): string {
  let pathname: string | undefined
  if (router) {
    pathname = router.asPath
  } else if (typeof window !== 'undefined') {
    pathname = location.pathname
  }

  if (pathname) {
    const params = new URLSearchParams({ from: pathname })
    return `/login?${params.toString()}`
  }
  return '/login'
}

/**
 * Base /note/[[XX]]
 * View /note/[[XX]]?view=1
 * Edit /note/[[XX]]/edit
 * Doc  /note/[[XX]]/doc/123456789
 */
export function getNotePageURL(
  page: 'base' | 'view' | 'edit' | 'doc',
  symbol: string,
  docId?: string,
): UrlObject {
  const pathname = '/note/[...slug]'

  if (page === 'base') return { pathname, query: { slug: [symbol] } }
  if (page === 'view') return { pathname, query: { slug: [symbol], view: 1 } }
  if (page === 'edit') return { pathname, query: { slug: [symbol, 'edit'] } }
  if (page === 'doc' && docId)
    return { pathname, query: { slug: [symbol, 'doc', docId] } }

  throw new Error('')
}

export function getCommitInputErrorItems(
  err: ApolloError,
): CommitInputErrorItem[] | null {
  const inputErr = err.graphQLErrors.find(
    e => e.extensions['code'] === 'COMMIT_INPUT_ERROR',
  )
  if (inputErr) {
    const items: CommitInputErrorItem[] = inputErr.extensions.items
    return items
  }
  return null
}
