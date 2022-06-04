import { UrlObject } from 'url'

export function getNotePageURL(
  page: 'view' | 'edit' | 'doc',
  symbol: string,
  docId?: string,
): UrlObject {
  const pathname = '/note/[...slug]'

  if (page === 'view') return { pathname, query: { slug: [symbol], view: 1 } }
  if (page === 'edit') return { pathname, query: { slug: [symbol, 'edit'] } }
  if (page === 'doc' && docId)
    return { pathname, query: { slug: [symbol, 'doc', docId] } }

  throw new Error('')
}
