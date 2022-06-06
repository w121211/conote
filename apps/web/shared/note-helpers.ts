import { UrlObject } from 'url'

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
