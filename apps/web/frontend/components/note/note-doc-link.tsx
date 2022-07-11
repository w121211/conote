import Link from 'next/link'
import { NoteDocFragment } from '../../../apollo/query.graphql'
import { getNotePageURL } from '../../utils'

const NoteDocLink = ({ doc }: { doc: NoteDocFragment }) => (
  <Link href={getNotePageURL(doc.symbol, doc.id)}>
    <a>
      {doc.symbol}#{doc.id.slice(-6)}
    </a>
  </Link>
)

export default NoteDocLink
