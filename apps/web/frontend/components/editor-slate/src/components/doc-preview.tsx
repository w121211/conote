import ReactMarkdown from 'react-markdown'
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown'
import { Node } from 'slate'
import ParseRenderEl from '../../../editor-textarea/src/components/inline/parse-render-el'
import { ElementIndenter } from '../interfaces'
import { docValueRepo } from '../stores/doc-value.repository'

const IndenterPreview = ({ indenter }: { indenter: ElementIndenter }) => {
  const { uid, indent } = indenter,
    str = Node.string(indenter)

  const components: ReactMarkdownOptions['components'] = {
    p: ({ node, children, ...props }) => {
      return (
        <p {...props}>
          {children.map((e, i) => {
            if (typeof e === 'string') {
              return (
                <span key={i}>
                  <ParseRenderEl key={i} blockUid={uid} str={e} isViewer />
                </span>
              )
            }
            return e
          })}
        </p>
      )
    },
  }

  return (
    <div style={{ marginLeft: 12 * indent }}>
      <ReactMarkdown components={components}>{str}</ReactMarkdown>
    </div>
  )
}

const DocPreview = ({ docUid }: { docUid: string }) => {
  const { value: indenters } = docValueRepo.getDocValue(docUid)

  return (
    <div>
      {indenters.map(e => (
        <IndenterPreview key={e.uid} indenter={e} />
      ))}
    </div>
  )
}

export default DocPreview
