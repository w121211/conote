import Link from 'next/link'
import { NoteDocFragment } from '../../apollo/query.graphql'
import { getNotePageURL } from '../../shared/note-helpers'

const NoteDocLink = ({ doc }: { doc: NoteDocFragment }) => (
  <Link href={getNotePageURL('doc', doc.symbol, doc.id)}>
    <a>
      {doc.symbol}#{doc.id.slice(-6)}
    </a>
  </Link>
)

export default NoteDocLink
