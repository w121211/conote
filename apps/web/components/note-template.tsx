import { nanoid } from 'nanoid'
import React, { useEffect, useState } from 'react'
import { useObservable } from 'rxjs-hooks'
import { BulletEditor } from './editor/editor'
import { LiElement } from './editor/slate-custom-types'
import { styleSymbol } from './ui-component/style-fc/style-symbol'
import { Doc } from './workspace/doc'
import { workspace } from './workspace/workspace'

const templateContent: LiElement[] = [
  {
    type: 'li',
    children: [{ type: 'lc', cid: nanoid(), children: [{ text: '22222' }] }],
  },
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
    <div className="inline-flex flex-col ml-9 ">
      <h5 className="text-gray-700 dark:text-gray-200">Similar notes</h5>
      {['[[Hello world]]', '[[Hello world (computer science)]]'].map(
        (title, i) => {
          return (
            <button
              key={i}
              className="flex items-center gap-1 mt-2 hover:bg-gray-100 dark:hover:bg-gray-600"
              // onClick={() => onTemplateChoose(templateContent)}
            >
              <span className="material-icons-outlined text-xl leading-none text-gray-400">
                description
              </span>
              {styleSymbol(title, '')}
            </button>
          )
        },
      )}
      <h5 className="mt-8 text-gray-700 dark:text-gray-200">Template</h5>
      {['General', 'Company', 'Research', 'Thing', 'Person', 'Empty'].map(
        (title, i) => {
          return (
            <button
              key={i}
              className="flex items-center gap-1 mt-2  text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              // onClick={() => onTemplateChoose(templateContent)}
            >
              <span className="material-icons-outlined text-xl leading-none text-gray-400">
                description
              </span>
              {styleSymbol(title, '')}
            </button>
          )
        },
      )}
    </div>
  )
}
