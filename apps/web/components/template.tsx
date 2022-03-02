import React, { useEffect, useState } from 'react'
import { useObservable } from 'rxjs-hooks'
import { BulletEditor } from './editor/editor'
import { Doc } from './workspace/doc'
import { workspace } from './workspace/workspace'

const templateContent = JSON.stringify([{ type: 'li', children: [{ type: 'lc', children: [{ text: '22222' }] }] }])

const TemplatePage = ({ doc }: { doc: Doc }) => {
  const [template, setTemplate] = useState<boolean | undefined>()
  const [newDoc, setNewDoc] = useState(false)
  const [renderEditor, setRenderEditor] = useState(false)
  // const modalDoc = useObservable(() => workspace.modalDoc$)
  useEffect(() => {
    if (template === true) {
      doc.setEditorValue(JSON.parse(templateContent))
      //   console.log(doc.editorValue)

      setNewDoc(true)
    } else if (template === false) {
      setNewDoc(true)
    }
  }, [template])

  // useEffect(() => {
  //   console.log(doc.editorValue)
  //   // setRenderEditor(true)
  // }, [doc.isEditorValueChangedSinceSave])

  if ((template === true && doc.isEditorValueChangedSinceSave) || template === false) {
    return <BulletEditor doc={doc} />
  }
  console.log(doc.editorValue)

  return (
    <div>
      <button onClick={() => setTemplate(true)}>使用模版頁面</button>
      <button onClick={() => setTemplate(false)}>使用空白頁面</button>
    </div>
  )
}

export default TemplatePage
