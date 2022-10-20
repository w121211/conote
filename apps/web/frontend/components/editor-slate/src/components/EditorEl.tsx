import { nanoid } from 'nanoid'
import React, { useMemo, useCallback, useEffect, useRef } from 'react'
import { createEditor, NodeEntry } from 'slate'
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from 'slate-react'
import { withHistory } from 'slate-history'
import { slateEditorRepo } from '../stores/editor.repository'
import { docEditorValueRepo } from '../stores/doc-editor-value.repository'
import { withAutoComplete } from '../auto-complete/with-auto-complete'
import { decorate } from '../decorate'
import { isIndenterArray } from '../indenter/normalizers'
import { indenterOnKeyDown } from '../indenter/onkeydown-indenter'
import { withIndenter } from '../indenter/with-indenter'
import type { ElementIndenter } from '../interfaces'
import IndenterEl from '../indenter/components/IndenterEl'
import LeafDiscuss from './leaf/leaf-discuss'
import LeafSymbol from './leaf/leaf-symbol'
import { useObservable } from '@ngneat/react-rxjs'
import {
  docTemplateGenerate,
  editorValueReset,
  editorValueUpdate,
} from '../events'
import DocPlaceholder from '../../../editor-textarea/src/components/doc/doc-placeholder'
import { docRepo } from '../../../editor-textarea/src/stores/doc.repository'
import { indentersToBlocks } from '../indenter/serializers'
import BlocksViewer from '../../../editor-textarea/src/components/block/BlocksViewer'
import { Id, toast } from 'react-toastify'

const Leaf = (
  props: RenderLeafProps & { docUid: string; draftId: string },
): JSX.Element => {
  const {
    attributes,
    children,
    leaf: { blockUid, inlineItem },
    docUid,
    draftId,
  } = props

  if (
    blockUid === undefined ||
    draftId === undefined ||
    inlineItem === undefined
  ) {
    throw new Error(
      'blockUid === undefined || draftId === undefined || inlineItem === undefined',
    )
  }

  let className = ''
  switch (inlineItem.type) {
    case 'inline-comment': {
      className = 'text-gray-400'
      break
    }
    case 'inline-discuss': {
      const id = nanoid()
      return (
        <LeafDiscuss
          leafProps={props}
          popoverProps={{ id, blockUid, docUid, draftId, inlineItem }}
        />
      )
    }

    case 'inline-symbol': {
      const id = nanoid()
      return (
        <LeafSymbol
          leafProps={props}
          popoverProps={{ id, blockUid, docUid, draftId, inlineItem }}
        />
      )
    }
    // case 'discuss-id':
    // case 'topic-bracket-head':
    // case 'topic-bracket-tail': {
    //   className = 'text-gray-400 '
    //   break
    // }
    // case 'discuss':
    // case 'discuss-bracket-start':
    // case 'discuss-bracket-end':
    // case 'discuss-new':
    // case 'filtertag':
    // case 'url': {
    //   className = 'text-green-600'
    //   break
    // }
    // default: {
    //   className = 'text-gray-700'
    // }
  }

  return (
    <span
      {...attributes}
      className={className}
      data-inline-item={inlineItem.type}
    >
      {children}
    </span>
  )
}

const CustomElement = (props: RenderElementProps) => {
  const { element, ...restProps } = props

  switch (element.type) {
    case 'indenter': {
      return <IndenterEl {...{ ...restProps, element }} />
    }
    default: {
      throw new Error('Only allow indenter element')
    }
  }
}

const Preview = ({ docUid }: { docUid: string }) => {
  const { value } = docEditorValueRepo.getValue(docUid),
    doc = docRepo.getDoc(docUid),
    docBlock = docRepo.getDocBlock(doc),
    bodyBlocks = indentersToBlocks(value, docBlock.uid),
    blocks = [docBlock, ...bodyBlocks]

  return <BlocksViewer blocks={blocks} />
}

const EditorEl = ({
  docUid,
  draftId,
  initialValue,
  preview = false,
}: {
  docUid: string
  draftId: string
  initialValue: ElementIndenter[]
  preview?: boolean
}) => {
  const [value] = useObservable(docEditorValueRepo.getValue$(docUid))
  const editor = useMemo(
    () =>
      withIndenter(withAutoComplete(withHistory(withReact(createEditor())))),
    [],
  )
  const renderElement = useCallback(
    (props: RenderElementProps) => <CustomElement {...props} />,
    [],
  )
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...{ ...props, docUid, draftId }} />,
    [],
  )
  const decorate_ = useCallback(
    ([node, path]: NodeEntry) => decorate([node, path], editor),
    [],
  )
  const toastIdRef = useRef<Id | null>(null)

  useEffect(() => {
    editorValueUpdate(docUid, initialValue)
  }, [])

  function onClickTemplateUndo() {
    editorValueReset(docUid)
    if (toastIdRef.current !== null) {
      toast.dismiss(toastIdRef.current)
    }
  }

  // useEffect(() => {
  //   // When doc changed, reset editor value,  https://github.com/ianstormtaylor/slate/issues/713
  //   Transforms.deselect(editor)
  //   setValue(initialValue)
  // }, [doc])

  // const { searchPanel, onKeyUp: onKeyUpBindSearchPanel } = useSearchPanel(
  //   editor,
  //   client,
  // )
  // useEffect(() => {
  //   if (searchAllResult.data) {
  //     setSuggestions(searchAllResult.data.searchAll)
  //   } else {
  //     setSuggestions(null)
  //   }
  // }, [searchAllResult])

  if (preview) {
    return <Preview docUid={docUid} />
  }

  if (value === undefined) {
    return null
  }

  if (value.value.length === 0) {
    return (
      <DocPlaceholder
        docUid={docUid}
        templateOnClick={templateName => {
          const [rootIndenter, ...bodyIndneters] = docTemplateGenerate(
            docUid,
            templateName,
          )

          editorValueUpdate(docUid, bodyIndneters)

          toastIdRef.current = toast.info(
            <div className="flex">
              <p className="flex-1 py-2">Template set.</p>
              <button className="btn-ghost-blue" onClick={onClickTemplateUndo}>
                Undo
              </button>
            </div>,
          )
        }}
      />
    )
  }

  return (
    <Slate
      editor={editor}
      value={value.value}
      onChange={v => {
        if (isIndenterArray(v)) {
          editorValueUpdate(docUid, v)
        } else {
          throw new Error('Value needs to be indenter array')
        }
      }}
    >
      <Editable
        autoCapitalize="false"
        // autoCorrect="false"
        // autoFocus={true}
        decorate={decorate_}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        spellCheck={false}
        onKeyDown={e => indenterOnKeyDown(e, editor)}
        // onKeyUp={event => {
        //   onKeyUpBindSearchPanel(event, editor)
        // }}
        onSelect={e => {
          const el = window
            .getSelection()
            ?.anchorNode?.parentElement?.closest('[data-inline-item]')

          if (el) {
            // console.log('onSelect', el)
            slateEditorRepo.setCurSelectedElId(el.id)
          } else {
            slateEditorRepo.setCurSelectedElId(null)
          }
        }}
      />
    </Slate>
  )
}

export default EditorEl
