import Link from 'next/link'
import { NoteDocFragment } from '../../../apollo/query.graphql'
import { getNotePageURL } from '../../utils'
import SymbolDecorate from '../symbol/SymbolDecorate'

const NoteDocLink = ({ doc }: { doc: NoteDocFragment }) => (
  <Link href={getNotePageURL(doc.symbol, doc.id)}>
    <a className="link">
      {/* {styleSymbol(doc.symbol)} */}
      {/* {doc.symbol}#{doc.id.slice(-6)} */}
      <SymbolDecorate symbol={doc.symbol} title={null} />
      <span className="text-gray-400 font-light">#{doc.id.slice(-6)}</span>
    </a>
  </Link>
)

export default NoteDocLink
