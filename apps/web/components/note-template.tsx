import { nanoid } from 'nanoid'
import { LiElement } from './editor/slate-custom-types'

const templateContent: LiElement[] = [
  { type: 'li', children: [{ type: 'lc', cid: nanoid(), children: [{ text: '22222' }] }] },
]

const NoteTemplate = ({
  onTemplateChoose,
}: {
  onTemplateChoose: (templateValue: LiElement[] | null) => void
}): JSX.Element => {
  return (
    <div>
      <button
        onClick={() => {
          onTemplateChoose(templateContent)
        }}
      >
        使用模版頁面
      </button>
      <button
        onClick={() => {
          onTemplateChoose(null)
        }}
      >
        使用空白頁面
      </button>
    </div>
  )
}

export default NoteTemplate
