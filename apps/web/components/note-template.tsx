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

const NoteTemplate = ({ doc, setShowTemplate }: { doc: Doc; setShowTemplate: (a: boolean) => void }): JSX.Element => {
  return (
    <div>
      <button
        onClick={() => {
          doc.setEditorValue(templateContent)
          setShowTemplate(false)
        }}
      >
        使用模版頁面
      </button>
      <button
        onClick={() => {
          setShowTemplate(false)
        }}
      >
        使用空白頁面
      </button>
    </div>
  )
}

export default NoteTemplate
