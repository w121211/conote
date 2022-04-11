import { InlineItem } from '../../interfaces'
import InlineSymbolEl from './components/inline-symbol-el'

const InlineEl = ({ inline }: { inline: InlineItem }) => {
  const { type, str } = inline

  switch (type) {
    case 'inline-discuss':
      return <span style={{ color: 'red' }}>{str}</span>
    case 'inline-symbol':
      return <InlineSymbolEl inline={inline} />
    case 'text':
      return <span>{str}</span>
  }
  return null
}

export default InlineEl
