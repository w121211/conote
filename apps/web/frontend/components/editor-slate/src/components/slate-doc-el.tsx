import { nanoid } from 'nanoid'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useObservable } from '@ngneat/react-rxjs'
import { createEditor, NodeEntry } from 'slate'
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from 'slate-react'
import { withHistory } from 'slate-history'
import { parseGQLBlocks } from '../../../../../share/utils'
import DocPlaceholder from '../../../editor-textarea/src/components/doc/doc-placeholder'
import { Doc } from '../../../editor-textarea/src/interfaces'
import { docTemplateGenerate, slateDocSave } from '../events'
import { slateEditorRepo } from '../stores/editor.repository'
import { docValueRepo } from '../stores/doc-value.repository'
import { editorChainItemSetRendered } from '../../../editor-textarea/src/events'
import { withAutoComplete } from '../auto-complete/with-auto-complete'
import { decorate } from '../decorate'
import { isIndenterArray } from '../indenter/normalizers'
import { indenterOnKeyDown } from '../indenter/onkeydown-indenter'
import { blocksToIndenters } from '../indenter/serializers'
import { withIndenter } from '../indenter/with-indenter'
import type { ElementIndenter } from '../interfaces'
import IndenterEl from '../indenter/components/indenter-el'
import LeafDiscuss from './leaf/leaf-discuss'
import LeafSymbol from './leaf/leaf-symbol'
import { toast } from 'react-toastify'
import { interval } from 'rxjs'

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
    default: {
      className = 'text-gray-600'
    }
  }

  return (
    <span
      {...attributes}
      className={className}
      data-inline-item={inlineItem.type}
      onSelect={() => {
        console.log('onSelect leaf')
      }}
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

const EditorEl = ({
  docUid,
  draftId,
  value,
}: {
  docUid: string
  draftId: string
  value: ElementIndenter[]
}) => {
  const editor = useMemo(
      () =>
        withIndenter(withAutoComplete(withHistory(withReact(createEditor())))),
      [],
    ),
    renderElement = useCallback(
      (props: RenderElementProps) => <CustomElement {...props} />,
      [],
    ),
    renderLeaf = useCallback(
      (props: RenderLeafProps) => <Leaf {...{ ...props, docUid, draftId }} />,
      [],
    ),
    decorate_ = useCallback(
      ([node, path]: NodeEntry) => decorate([node, path], editor),
      [],
    )

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

  return (
    <div className="text-gray-800">
      <Slate
        editor={editor}
        value={value}
        onChange={v => {
          if (isIndenterArray(v)) {
            docValueRepo.setDocValue(docUid, v)
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
          // readOnly={readOnly}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck={false}
          onKeyDown={e => {
            indenterOnKeyDown(e, editor)
          }}
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
    </div>
  )
}

/**
 * Include error handling
 */
async function saveDoc(docUid: string) {
  try {
    await slateDocSave(docUid)
  } catch (err) {
    if (err instanceof Error && err.message === 'indent_oversize') {
      toast.error(
        <div>
          The draft cannot be saved. Please fix the indentation error(s).
        </div>,
      )
    } else {
      throw err
    }
  }
}

const SlateDocEl = (props: { doc: Doc }) => {
  // console.log('SlateDocEl')
  const { doc } = props,
    [docValue] = useObservable(docValueRepo.getDocValue$(doc.uid))

  useEffect(() => {
    const { blocks: gqlBlocks } = doc.noteDraftCopy.contentBody,
      { blocks } = parseGQLBlocks(gqlBlocks),
      [rootIndenter, ...bodyIndenters] = blocksToIndenters(blocks)

    docValueRepo.setDocValue(doc.uid, bodyIndenters)

    const interval$ = interval(30000),
      sub = interval$.subscribe(() => saveDoc(doc.uid))

    return () => {
      sub.unsubscribe()

      // When the doc is committed or deleted, it will trigger the component unmount and thus throws 'doc not found' error
      saveDoc(doc.uid).catch(err => console.debug(err))
    }
  }, [])

  useEffect(() => {
    if (docValue !== undefined) {
      editorChainItemSetRendered(doc.uid)
    }
  }, [docValue])

  if (docValue === undefined) return null

  return (
    <div>
      {docValue.value.length === 0 ? (
        <DocPlaceholder
          doc={doc}
          templateOnClick={() => {
            const [rootIndenter, ...bodyIndneteers] = docTemplateGenerate(doc)
            docValueRepo.setDocValue(doc.uid, bodyIndneteers)
          }}
        />
      ) : (
        <EditorEl
          docUid={doc.uid}
          draftId={doc.noteDraftCopy.id}
          value={docValue.value}
        />
      )}
      {/* <button onClick={() => saveDoc(doc.uid)}>Save</button> */}
    </div>
  )
}

export default SlateDocEl
