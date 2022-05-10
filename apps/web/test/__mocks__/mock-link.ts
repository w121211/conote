import { Link } from '@prisma/client'
import { FetchResult } from '../../lib/fetcher/fetch-client'

export const mockLinks: (Omit<Link, 'scraped'> & { scraped: FetchResult })[] = [
  {
    id: 'mock-link-0',
    url: 'https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url',
    domain: 'stackoverflow.com',
    scraped: {
      domain: 'stackoverflow.com',
      finalUrl:
        'https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url',
      srcType: 'OTHER',
    },
    authorId: null,
  },
]
