import type { ApolloError } from '@apollo/client'
import type { NextRouter } from 'next/router'
import type { UrlObject } from 'url'
import type { CommitInputErrorItem } from '../lib/interfaces'

//
// Page URLs
//
//
//
//
//
//

export function getCommitPageURL(commitId: string): UrlObject {
  return {
    pathname: '/commit/[commitid]',
    query: { commitid: commitId },
  }
}

/**
 * /draft/[chainFirstDraftId]#[draftId]
 * /draft/[draftId] - This also will open a chain and focus on the draft-id, however, this lost the ability of
 */
export function getDraftPageURL(
  draftId: string,
  chainFirstDraftId?: string,
): UrlObject {
  if (chainFirstDraftId) {
    return {
      pathname: '/draft/[draftid]',
      query: { draftid: draftId },
      // query: { draftid: chainFirstDraftId },
      // hash: draftId,
    }
  }
  return { pathname: '/draft/[draftid]', query: { draftid: draftId } }
}

/**
 * /draft?s=[symbol]
 */
export function getDraftPageURLBySymbol(symbol: string): UrlObject {
  return { pathname: '/draft', query: { s: symbol } }
}

/**
 * TODO
 * - [] When SSR, not able to provide a redirect back url
 */
export function getLoginPageURL(router?: NextRouter): string {
  let path: string | undefined
  if (router) {
    path = router.asPath
  } else if (typeof window !== 'undefined') {
    path = location.pathname
  }

  if (path) {
    const params = new URLSearchParams({ from: path })
    return `/login?${params.toString()}`
  }
  return '/login'
}

/**
 * /note/[[XX]]
 * /note/[[XX]]/doc/123456789
 */
export function getNotePageURL(symbol: string, docId?: string): UrlObject {
  const pathname = '/note/[...slug]'
  if (docId) {
    return { pathname, query: { slug: [symbol, 'doc', docId] } }
  }
  return { pathname, query: { slug: [symbol] } }
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
