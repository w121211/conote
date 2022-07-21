import React, { useState, useMemo, useCallback, useEffect } from 'react'
import {
  Editor,
  Transforms,
  createEditor,
  Node,
  NodeEntry,
  Range,
  Text,
  Path,
  Element,
  Point,
} from 'slate'
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useFocused,
  useReadOnly,
  useSelected,
  useSlateStatic,
  withReact,
} from 'slate-react'
import { withHistory } from 'slate-history'
import { wrapToInlines } from '../with-inline'
import InlineSymbol from './inline/inline-symbol'
import { decorate } from '../decorate'
import { onKeyDown as onKeyDownWithList, ulPath, withList } from '../with-list'
import { withAutoComplete } from '../with-auto-complete'
import { Doc } from '../../../block-editor/src/interfaces'
import { parseGQLBlocks } from '../../../../../share/utils'
import { blocksToLiList } from '../serializers'
import type { ElementLc, ElementLi, ElementUl } from '../interfaces'
import { isLiArray, isUl } from '../utils'
import { useObservable } from '@ngneat/react-rxjs'
import { docTemplateGenerate, slateDocSave } from '../events'
import { slateEditorRepo } from '../stores/editor.repository'
import DocPlaceholder from '../../../block-editor/src/components/doc/doc-placeholder'
import { docValueRepo } from '../stores/doc-value.repository'
import { editorChainItemSetRendered } from '../../../block-editor/src/events'
import PopoverLeafDiscuss from './leaf/leaf-discuss'
import { nanoid } from 'nanoid'

const Leaf = (props: RenderLeafProps): JSX.Element => {
  const { attributes, leaf, children } = props,
    { blockUid, draftId, inlineItem } = leaf

  let className = ''
  switch (inlineItem.type) {
    case 'inline-comment': {
      className = 'text-gray-400'
      break
    }
    // case 'inline-symbol': {
    //   const popoverProps: PopoverPanelProps = {
    //     elId: nanoid(),
    //     blockUid,
    //     draftUid,
    //     inlineItem,
    //   }
    //   return (
    //     <LeafWithPopover
    //       leafProps={props}
    //       PopoverPanel={PopoverPanelSymbol}
    //       popoverPanelProps={popoverProps}
    //     />
    //   )
    // }
    case 'inline-discuss':
      return (
        <PopoverLeafDiscuss
          leafProps={props}
          id={nanoid()}
          blockUid={blockUid}
          draftId={draftId}
          inlineItem={inlineItem}
        />
      )
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

const LcDynamic = ({
  attributes,
  children,
  element,
}: RenderElementProps & {
  element: ElementLc
}): JSX.Element => {
  const editor = useSlateStatic()
  const readonly = useReadOnly()
  const focused = useFocused() // Is editor in focus
  const selected = useSelected() // Is element selected, ie cursor inside this element

  useEffect(() => {
    // Cursor left lc, wrap lc to inlines
    if (!focused || !selected || readonly) {
      // console.log(editor.history.undos)
      const path = ReactEditor.findPath(editor, element)
      wrapToInlines({ editor, lcEntry: [element, path] })
      return
    }

    // Cursor enters lc, unwrap inlines to string
    if (selected) {
      // Fix undo bug
      const { undos } = editor.history
      if (undos.length >= 2) {
        const lastBatch = undos[undos.length - 1]
        if (
          lastBatch.length >= 2 &&
          lastBatch[0].type === 'remove_node' &&
          lastBatch[1].type === 'insert_node'
        ) {
          // Looks like wrap lc just happened, merge undos
          const _lastBatch = undos.pop()
          if (_lastBatch) {
            undos[undos.length - 1] = undos[undos.length - 1].concat(_lastBatch)
          }
        }
      }

      const path = ReactEditor.findPath(editor, element)

      Transforms.unwrapNodes(editor, {
        at: path,
        match: (n, p) => Element.isElement(n) && Path.isChild(p, path),
      })
    }
  }, [selected, readonly])

  // const mirrors = element.children.filter((e): e is InlineMirrorElement => e.type === 'mirror')
  // console.log(element.bulletCopy?.id)

  return (
    <span
      {...attributes}
      className="py-1"
      // onMouseEnter={e => {
      //   const arrow = e.currentTarget.parentElement?.parentElement
      //     ?.firstElementChild?.firstElementChild as HTMLElement
      //   if (arrow) {
      //     arrow.style.visibility = 'visible'
      //   }
      // }}
      // onMouseLeave={e => {
      //   const arrow = e.currentTarget.parentElement?.parentElement
      //     ?.firstElementChild?.firstElementChild as HTMLElement
      //   if (arrow) {
      //     arrow.style.removeProperty('visibility')
      //   }
      // }}
    >
      {children}
      {/* {element.bulletCopy?.id && <BulletEmojiButtonGroup bulletId={element.bulletCopy.id} />} */}
      {/* {sourceNoteId && ( 
       <span contentEditable={false}>
        {author === element.author && element.author}
          {sourceUrl === element.sourceUrl && sourceUrl} 
        <FilterMirror mirrors={mirrors} />
      </span> 
       )} */}
    </span>
  )
}

const LcStatic = ({
  attributes,
  children,
  element,
}: RenderElementProps & {
  element: ElementLc
}): JSX.Element => {
  const editor = useSlateStatic(),
    { selection } = editor

  useEffect(() => {
    // console.log('lc', selection)
  }, [selection])

  return <span {...attributes}>{children}</span>
}

const Li = ({
  attributes,
  children,
  element,
}: RenderElementProps & { element: ElementLi }): JSX.Element => {
  // const editor = useSlateStatic()
  // const [hasUl, setHasUl] = useState(false)
  // const [ulFolded, setUlFolded] = useState<true | undefined>()
  // const [showPanel, setShowPanel] = useState(false)
  // console.log(element)

  // useEffect(() => {
  //   const [, ul] = element.children
  //   if (ul) {
  //     setHasUl(true)
  //   } else {
  //     setHasUl(false)
  //   }
  //   // const path = ReactEditor.findPath(editor, element)
  //   // try {
  //   //   const ul = Editor.node(editor, ulPath(path))
  //   //   if (isUl(ul[0])) {
  //   //     setHasUl(true)
  //   //     // setUlFolded(ul[0].folded)
  //   //   }
  //   // } catch (err) {
  //   //   // 找不到ul
  //   //   setHasUl(false)
  //   //   // setUlFolded(undefined)
  //   // }
  // }, [editor, element])

  const [lc, ul] = element.children
  const hasUl = ul !== undefined

  return (
    <div
      {...attributes}
      className="relative break-words flex items-start w-full "
    >
      <div
        className="group h-8 inline-flex items-center select-none"
        contentEditable={false}
      >
        {/* <span
          className={`flex-shrink-0 flex-grow-0 flex items-center invisible group-hover:visible  ${
            hasUl ? 'opacity-100 group-hover:cursor-pointer' : 'opacity-0 '
          }`}
          onClick={event => {
            // Set 'folded' property
            event.preventDefault()
            const path = ReactEditor.findPath(editor, element)
            try {
              const ul = Editor.node(editor, ulPath(path))
              if (isUl(ul[0])) {
                Transforms.deselect(editor)
                Transforms.setNodes<ElementUl>(
                  editor,
                  { folded: ul[0].folded ? undefined : true },
                  { at: ul[1] },
                )
                setUlFolded(ul[0].folded ? undefined : true)
              }
            } catch (err) {
              // Do nothing
            }
          }}
        >
          <span className={`material-icons w-4 text-lg leading-none`}>
            {ulFolded === undefined ? 'arrow_drop_down' : 'arrow_right'}
          </span>
        </span> */}
        <span className={`relative flex-grow px-1`}>
          <span
            className={
              `material-icons text-xs scale-[.65] text-gray-600 
            before:content-['']  before:w-5 before:h-5 before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:absolute before:rounded-full before:-z-10 `
              // ${
              //   ulFolded === undefined
              //     ? 'before:bg-transparent'
              //     : 'before:bg-gray-300'
              // }
              // `
            }
          >
            fiber_manual_record
          </span>
          {/* {lc.bulletCopy?.id && (
            <BulletPanel bulletId={lc.bulletCopy.id} visible={showPanel} onClose={() => setShowPanel(false)} />
          )} */}
        </span>
        {/* {lc.id && <AddEmojiButotn bulletId={lc.id} emojiText={'UP'} onCreated={onEmojiCreated} />} */}
      </div>

      <div className=" w-full align-top">{children}</div>
    </div>
  )
}

const Ul = ({
  attributes,
  children,
  element,
}: RenderElementProps & { element: ElementUl }): JSX.Element => {
  // return (
  //   <ul {...attributes} className={'list-disc'}>
  //     {children}
  //   </ul>
  // )
  return (
    <div {...attributes} className={`${element.folded ? 'hidden' : 'block'}`}>
      {children}
    </div>
  )
}

const CustomElement = ({
  attributes,
  children,
  element,
}: RenderElementProps): JSX.Element => {
  switch (element.type) {
    // case 'inline-discuss':
    //   return (
    //     <InlineDiscuss
    //       {...{ attributes, children, element, noteId: note?.id }}
    //     />
    //   )
    // case 'inline-filtertag':
    //   return <InlineFiltertag {...{ attributes, children, element }} />
    // case 'inline-mirror':
    //   return (
    //     <InlineMirror
    //       {...{ attributes, children, element, sourceNoteId: note?.id }}
    //     />
    //   )
    // case 'inline-poll':
    //   return <InlinePoll {...{ attributes, children, element }} />
    // case 'inline-rate':
    //   return <InlineRate {...{ attributes, children, element }} />
    case 'inline-symbol':
      return <InlineSymbol {...{ attributes, children, element }} />
    // case 'inline-comment':
    //   return <InlineComment {...{ attributes, children, element }} />
    case 'lc':
      return <LcStatic {...{ attributes, children, element }} />
    case 'li':
      return <Li {...{ attributes, children, element }} />
    case 'ul':
      return <Ul {...{ attributes, children, element }} />
    default:
      return <span {...attributes}>{children}</span>
  }
}

const EditorEl = ({
  docUid,
  draftId,
  value,
}: {
  docUid: string
  draftId: string
  value: ElementLi[]
}) => {
  const editor = useMemo(
      () => withList(withAutoComplete(withHistory(withReact(createEditor())))),
      [],
    ),
    renderElement = useCallback(
      (props: RenderElementProps) => <CustomElement {...{ ...props }} />,
      [],
    ),
    renderLeaf = useCallback(
      (props: RenderLeafProps) => <Leaf {...props} />,
      [],
    ),
    decorate_ = useCallback(
      ([node, path]: NodeEntry) => decorate([node, path], editor, draftId),
      [],
    )

  // const [value, setValue] = useState<ElementLi[]>(initialValue)

  // useEffect(() => {
  //   // When doc changed, reset editor value,  https://github.com/ianstormtaylor/slate/issues/713
  //   Transforms.deselect(editor)
  //   setValue(initialValue)
  // }, [doc])

  // useEffect(() => {
  //   console.log(`BulletEditor enter ${doc.getSymbol()}`)
  //   return () => {
  //     console.log(`BulletEditor unmount ${doc.getSymbol()}`)
  //   }
  // }, [])

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
          if (isLiArray(v)) {
            // setValue(v)
            docValueRepo.setDocValue(docUid, v)
          } else {
            throw new Error('Value needs to be li array')
          }
        }}
      >
        <Editable
          autoCapitalize="false"
          autoCorrect="false"
          // autoFocus={true}
          decorate={decorate_}
          // readOnly={readOnly}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck={false}
          onKeyDown={event => {
            onKeyDownWithList(event, editor)
          }}
          // onKeyUp={event => {
          //   onKeyUpBindSearchPanel(event, editor)
          // }}
          onSelect={e => {
            const el = window
              .getSelection()
              ?.anchorNode?.parentElement?.closest('[data-inline-item]')

            if (el) {
              console.log('onSelect', el)
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

const SlateDocEl = (props: { doc: Doc }) => {
  const { doc } = props,
    [docValue] = useObservable(docValueRepo.getDocValue$(doc.uid))

  useEffect(() => {
    const { blocks: gqlBlocks } = doc.noteDraftCopy.contentBody,
      { blocks } = parseGQLBlocks(gqlBlocks),
      value = blocksToLiList(blocks)
    docValueRepo.setDocValue(doc.uid, value)
    // const interval$ = interval(30000)
    // const sub = interval$.subscribe(() => docSave(doc.uid))

    return () => {
      // console.log('DocEl unmount')
      // sub.unsubscribe()
      slateDocSave(doc.uid).catch(err => console.debug(err))
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
            const lis = docTemplateGenerate(doc)
            docValueRepo.setDocValue(doc.uid, lis)
          }}
        />
      ) : (
        <EditorEl
          docUid={doc.uid}
          draftId={doc.noteDraftCopy.id}
          value={docValue.value}
        />
      )}
      {/* <button onClick={() => slateDocSave(doc.uid)}>Save</button> */}
    </div>
  )
}

export default SlateDocEl
