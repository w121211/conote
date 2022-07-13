import Link from 'next/link'
import { NoteDocFragment } from '../../../apollo/query.graphql'
import { getNotePageURL } from '../../utils'
import { styleSymbol } from '../ui-component/style-fc/style-symbol'

const NoteDocLink = ({ doc }: { doc: NoteDocFragment }) => (
  <Link href={getNotePageURL(doc.symbol, doc.id)}>
    <a>
      {styleSymbol(doc.symbol)}
      <span className="text-gray-400 text-sm">#{doc.id.slice(-6)}</span>
    </a>
  </Link>
)

export default NoteDocLink
