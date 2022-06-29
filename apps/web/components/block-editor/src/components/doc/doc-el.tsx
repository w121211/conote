import { useObservable } from '@ngneat/react-rxjs'
import React, { useEffect, useState } from 'react'
import { interval } from 'rxjs'
import { docSave } from '../../events'
import type { Doc } from '../../interfaces'
import { hotkey, multiBlockSelection } from '../../listeners'
import { blockRepo } from '../../stores/block.repository'
import { docRepo } from '../../stores/doc.repository'
import { BlockEl } from '../block/block-el'
import DocHead from './doc-head'
import DocPlaceholder from './doc-placeholder'

interface DocProps {
  // assume to be block-els, if given, use it and ignore doc-block's children
  children?: React.ReactNode

  // /**
  //  * Whether the page is a Daily Note
  //  */
  // isDailyNote: boolean
  // /**
  //  * Whether the page has a corresponding shortcut
  //  */
  // hasShortcut?: boolean
  // /**
  //  * The title of the page
  //  */
  // title: React.ReactNode
  // /**
  //  * Whether the page can be edited
  //  */
  isEditable?: boolean
  // /**
  //  * The unique identifier of the page
  //  */
  // uid: string
  // handlePressRemoveShortcut(): void
  // handlePressAddShortcut(): void
  // handlePressShowLocalGraph(): void
  // handlePressDelete(): void

  doc: Doc
}

export const DocEl = ({
  // isDailyNote,
  // hasShortcut,
  // children,
  // title,
  // uid,
  // isLinkedReferencesOpen,
  // isUnlinkedReferencesOpen,
  // handlePressLinkedReferencesToggle,
  // handlePressUnlinkedReferencesToggle,
  // handlePressRemoveShortcut,
  // handlePressAddShortcut,
  // handlePressShowLocalGraph,
  // handlePressDelete,
  isEditable = true,
  // children,
  doc,
}: DocProps): JSX.Element | null => {
  const [isPageMenuOpen, setIsPageMenuOpen] = useState(false),
    [pageMenuAnchor, setPageMenuAnchor] = useState<HTMLButtonElement | null>(
      null,
    )

  const [docBlock] = useObservable(blockRepo.getBlock$(doc.blockUid), {
      deps: [doc],
      initialValue: null,
    }),
    interval$ = interval(30000)

  // (BUG) useObservable set docBlock as null initially if default value is undefined
  // however, the return type will not include null
  // const docBlock = useObservable<Block | undefined, [Doc]>(
  //   (_, inputs$) =>
  //     inputs$.pipe(
  //       tap(console.log),
  //       switchMap(([v]) => blockRepo.getBlock$(v.blockUid)),
  //     ),
  //   undefined,
  //   [doc],
  // )

  // useEffect(() => {
  //   console.log(docBlockUid, docBlock)
  //   // console.log(docBlock)
  // }, [docBlockUid, docBlock])

  useEffect(() => {
    const sub = interval$.subscribe(async () => {
      await docSave(doc.uid)
    })

    return () => {
      // console.log('DocEl unmount')
      sub.unsubscribe()
      docSave(doc.uid).catch(err => {
        // In case user delete the doc and cause doc-el unmount
        console.debug(err)
      })
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', hotkey)
    document.addEventListener('keydown', multiBlockSelection)

    return () => {
      document.removeEventListener('keydown', hotkey)
      document.removeEventListener('keydown', multiBlockSelection)
    }
  }, [])

  const handlePressMenuToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPageMenuAnchor(e.currentTarget)
    setIsPageMenuOpen(true)
  }

  // const handleClosePageMenu = () => {
  //   setPageMenuAnchor(null)
  //   setIsPageMenuOpen(false)
  // }

  if (docBlock === undefined || docBlock === null) {
    return null
  }

  return (
    <article
      className="
      node-page
      basis-full 
      self-stretch 
      w-full max-w-[60em] 
      -ml-4 
      "
    >
      <DocHead doc={doc} />

      {/* <button
        className="
      float-left 
      w-8 h-8 
      rounded-full 
      -ml-10 mt-2 
      align-bottom 
      text-[#AAA]/75"
        // shape="round"
        // isPressed={isPageMenuOpen}
        onClick={handlePressMenuToggle}
      >
        <MoreHoriz />
      </button> */}

      {/* <PopperUnstyled
        open={isPageMenuOpen}
        anchorEl={pageMenuAnchor}
        disablePortal={true}
        placement="bottom-start"
      >
        <button>hello</button>
        <button>world</button>
      </PopperUnstyled> */}

      {/* <PageHeader>
        <Title>
          <PageMenuToggle
            // shape="round"
            // isPressed={isPageMenuOpen}
            onClick={handlePressMenuToggle}
          >
            <MoreHoriz />
          </PageMenuToggle>
          <Modal
            onClose={handleClosePageMenu}
            BackdropProps={{ invisible: true }}
            container={DOMRoot}
            open={isPageMenuOpen}
          >
            <Popper
              open={isPageMenuOpen}
              anchorEl={pageMenuAnchor}
              disablePortal={true}
              placement="bottom-start"
            >
              <Overlay className="animate-in">
                <Menu>
                  {hasShortcut ? (
                    <Button onClick={handlePressRemoveShortcut}>
                      <Bookmark /> <span>Remove Shortcut</span>
                    </Button>
                  ) : (
                    <Button onClick={handlePressAddShortcut}>
                      <Bookmark /> <span>Add Shortcut</span>
                    </Button>
                  )}
                  <Button onClick={handlePressShowLocalGraph}>
                    <BubbleChart /> <span>Show Local Graph</span>
                  </Button>
                  <Menu.Separator />
                  <Button onClick={handlePressDelete}>
                    <Delete /> <span>Delete Page</span>
                  </Button>
                </Menu>
              </Overlay>
            </Popper>
          </Modal>
          {title} {isDailyNote && <Today />}
          {title}
        </Title>
      </PageHeader> */}

      {/* {children ? (
        children
      ) : isEditable ? (
        <BlocksContainer>
          {block.childrenUids.map((e) => (
            <BlockEl key={e} uid={e} isEditable={isEditable} />
          ))}
        </BlocksContainer>
      ) : (
        <DocPlaceholder />
      )} */}

      {/* <NoteHead
        isNew
        symbol={doc.title}
        title="test test test"
        // link="http://asdfasdf.asdfasdf.com"
        fetchTime={new Date()}
        nodeId="asdfasdfas"
      /> */}

      {/* <button
        onClick={() => {
          docSave(doc)
        }}
      >
        Save
      </button>

      <button
        onClick={() => {
          docRemove(doc)
        }}
      >
        Remove
      </button> */}

      {
        // children ? (
        //   children
        // ) : docBlock.childrenUids.length > 0 ? (
        docBlock.childrenUids.length > 0 ? (
          // <BlocksContainer>
          <div>
            {docBlock.childrenUids.map(e => (
              <BlockEl key={e} uid={e} isEditable={isEditable} />
            ))}
          </div>
        ) : (
          <DocPlaceholder doc={doc} />
        )
      }
    </article>
  )
}
