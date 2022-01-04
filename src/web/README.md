## /card/[symbol]

DocEntryList {docEntries}

- DocEntry
  - Title:link /card/{symbol}
  - Drop:button onClick = workspace.save()
  - Commit:button onClick = workspace.commit()

SideBarSection

- children

SideBar

- SideBarSection (committed)
  - DocEntryList <- workspace.committedDocs$
- SideBarSection (saved)
  - DocEntryList <- workspace.savedDocEntries$

CardHead {doc}

- title, author, symbols, hashtags
- HiddenPanel
  - button (open CardMetaFormModal)
  - Link (open source)
- Modal
  - CardMetaForm {cardMeta, onSubmitted} -> save card meta to local doc

CardEditor { symbol, card? }

- #
  - mainDoc$ <- workspace.openMainDoc(symbol, card)
- CardHead <- mainDoc
- BulletEditor <- mainDoc

ModalCardEdtior { symbol, card? }

- #
  - modalDoc$ <- workspace.openModalDoc(symbol, card)
- button-link (expand as mainDoc)
- CardHead <- modalDoc
- BulletEditor <- modalDoc

CardSymbolPage

- #
  - main {symbol, card?}, modal? {symbol, card?} <- queryCard, queryModalCard <- symbol, modalSymbol? <- route
- Modal
  - CardEditor <- modal? {symbol, card}
- NavBar
  - Login:link / Logout:button
- CardEditor
- SideBar

Routing

- /$A
  - {$A}
- -> /$A?pop=$B&from=$A
  - {$C, from=$A} -> if no doc $A, ignore from -> {$C}
- -> /$A?pop=$C&from=$B
- -> (expand pop) /$C
