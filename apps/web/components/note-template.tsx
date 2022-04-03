import { nanoid } from 'nanoid'
import React, { useEffect, useState } from 'react'
import { useObservable } from 'rxjs-hooks'
import { BulletEditor } from './editor/editor'
import { LiElement } from './editor/slate-custom-types'
import { Doc } from './workspace/doc'
import { workspace } from './workspace/workspace'

const templateContent: LiElement[] = [
  { type: 'li', children: [{ type: 'lc', cid: nanoid(), children: [{ text: '22222' }] }] },
]

export const NoteTemplate = ({
  onTemplateChoose,
}: {
  onTemplateChoose: (templateValue: LiElement[] | null) => void
}) => {
  const [template, setTemplate] = useState<boolean | undefined>()
  const [newDoc, setNewDoc] = useState(false)
  const [renderEditor, setRenderEditor] = useState(false)
  // const modalDoc = useObservable(() => workspace.modalDoc$)
  // useEffect(() => {
  //   if (template === true) {
  //     doc.setEditorValue(JSON.parse(templateContent))
  //     //   console.log(doc.editorValue)

  //     setNewDoc(true)
  //   } else if (template === false) {
  //     setNewDoc(true)
  //   }
  // }, [template])

  // useEffect(() => {
  //   console.log(doc.editorValue)
  //   // setRenderEditor(true)
  // }, [doc.isEditorValueChangedSinceSave])

  // if ((template === true && doc.isEditorValueChangedSinceSave) || template === false) {
  //   return <BulletEditor doc={doc} />
  // }
  // console.log(doc.editorValue)

  return (
    <div className="inline-flex flex-col ml-9 gap-4">
      <button
        className="btn-reset-style px-3 py-2 rounded bg-gray-100  text-gray-500 hover:text-gray-800 hover:bg-gray-200"
        onClick={() => onTemplateChoose(templateContent)}
      >
        使用模版頁面
      </button>
      <button
        className="btn-reset-style px-3 py-2 rounded bg-gray-100  text-gray-500 hover:text-gray-800 hover:bg-gray-200"
        onClick={() => onTemplateChoose(null)}
      >
        使用空白頁面
      </button>
    </div>
  )
}
