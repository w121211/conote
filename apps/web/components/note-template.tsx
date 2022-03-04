import { nanoid } from 'nanoid'
import { LiElement } from './editor/slate-custom-types'
import { Doc } from './workspace/doc'

const templateContent: LiElement[] = [
  { type: 'li', children: [{ type: 'lc', cid: nanoid(), children: [{ text: '22222' }] }] },
]

const NoteTemplate = ({ doc, onTemplateSet }: { doc: Doc; onTemplateSet: () => void }): JSX.Element => {
  return (
    <div>
      <button
        onClick={() => {
          doc.setEditorValue(templateContent)
          onTemplateSet()
        }}
      >
        使用模版頁面
      </button>
      <button
        onClick={() => {
          onTemplateSet()
        }}
      >
        使用空白頁面
      </button>
    </div>
  )
}

export default NoteTemplate
