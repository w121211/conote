/* eslint-disable no-console */
/**
 * See: https://github.com/ianstormtaylor/slate/blob/main/docs/concepts/12-typescript.md
 *      https://github.com/ianstormtaylor/slate/blob/main/site/pages/examples/%5Bexample%5D.tsx
 */
// import Prism from 'prismjs'
import React, {
  useState,
  useCallback,
  useMemo,
  CSSProperties,
  useEffect,
  KeyboardEvent,
  ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import {
  createEditor,
  Descendant,
  Text,
  NodeEntry,
  Range,
  Editor,
  Transforms,
} from 'slate'
import { withHistory } from 'slate-history'
import {
  Editor as CardEditor,
  ExtTokenStream,
  streamToStr,
} from '../../packages/editor/src/index'
import { CustomEditor, CustomText } from './custom-types'

const CHARACTERS = [
  'Aayla Secura',
  'Adi Gallia',
  'Admiral Dodd Rancit',
  'Admiral Firmus Piett',
  'Admiral Gial Ackbar',
  'Admiral Ozzel',
  'Admiral Raddus',
  'Admiral Terrinald Screed',
  'Admiral Trench',
  'Admiral U.O. Statura',
  'Agen Kolar',
  'Agent Kallus',
  'Aiolin and Morit Astarte',
  'Aks Moe',
  'Almec',
  'Alton Kastle',
  'Amee',
  'AP-5',
  'Armitage Hux',
  'Artoo',
  'Arvel Crynyd',
  'Asajj Ventress',
  'Aurra Sing',
  'AZI-3',
  'Bala-Tik',
  'Barada',
  'Bargwill Tomder',
  'Baron Papanoida',
  'Barriss Offee',
  'Baze Malbus',
  'Bazine Netal',
  'BB-8',
  'BB-9E',
  'Ben Quadinaros',
  'Berch Teller',
  'Beru Lars',
  'Bib Fortuna',
  'Biggs Darklighter',
  'Black Krrsantan',
  'Bo-Katan Kryze',
  'Boba Fett',
  'Bobbajo',
  'Bodhi Rook',
  'Borvo the Hutt',
  'Boss Nass',
  'Bossk',
  'Breha Antilles-Organa',
  'Bren Derlin',
  'Brendol Hux',
  'BT-1',
  'C-3PO',
  'C1-10P',
  'Cad Bane',
  'Caluan Ematt',
  'Captain Gregor',
  'Captain Phasma',
  'Captain Quarsh Panaka',
  'Captain Rex',
  'Carlist Rieekan',
  'Casca Panzoro',
  'Cassian Andor',
  'Cassio Tagge',
  'Cham Syndulla',
  'Che Amanwe Papanoida',
  'Chewbacca',
  'Chi Eekway Papanoida',
  'Chief Chirpa',
  'Chirrut Îmwe',
  'Ciena Ree',
  'Cin Drallig',
  'Clegg Holdfast',
  'Cliegg Lars',
  'Coleman Kcaj',
  'Coleman Trebor',
  'Colonel Kaplan',
  'Commander Bly',
  'Commander Cody (CC-2224)',
  'Commander Fil (CC-3714)',
  'Commander Fox',
  'Commander Gree',
  'Commander Jet',
  'Commander Wolffe',
  'Conan Antonio Motti',
  'Conder Kyl',
  'Constable Zuvio',
  'Cordé',
  'Cpatain Typho',
  'Crix Madine',
  'Cut Lawquane',
  'Dak Ralter',
  'Dapp',
  'Darth Bane',
  'Darth Maul',
  'Darth Tyranus',
  'Daultay Dofine',
  'Del Meeko',
  'Delian Mors',
  'Dengar',
  'Depa Billaba',
  'Derek Klivian',
  'Dexter Jettster',
  'Dineé Ellberger',
  'DJ',
  'Doctor Aphra',
  'Doctor Evazan',
  'Dogma',
  'Dormé',
  'Dr. Cylo',
  'Droidbait',
  'Droopy McCool',
  'Dryden Vos',
  'Dud Bolt',
  'Ebe E. Endocott',
  'Echuu Shen-Jon',
  'Eeth Koth',
  'Eighth Brother',
  'Eirtaé',
  'Eli Vanto',
  'Ellé',
  'Ello Asty',
  'Embo',
  'Eneb Ray',
  'Enfys Nest',
  'EV-9D9',
  'Evaan Verlaine',
  'Even Piell',
  'Ezra Bridger',
  'Faro Argyus',
  'Feral',
  'Fifth Brother',
  'Finis Valorum',
  'Finn',
  'Fives',
  'FN-1824',
  'FN-2003',
  'Fodesinbeed Annodue',
  'Fulcrum',
  'FX-7',
  'GA-97',
  'Galen Erso',
  'Gallius Rax',
  'Garazeb "Zeb" Orrelios',
  'Gardulla the Hutt',
  'Garrick Versio',
  'Garven Dreis',
  'Gavyn Sykes',
  'Gideon Hask',
  'Gizor Dellso',
  'Gonk droid',
  'Grand Inquisitor',
  'Greeata Jendowanian',
  'Greedo',
  'Greer Sonnel',
  'Grievous',
  'Grummgar',
  'Gungi',
  'Hammerhead',
  'Han Solo',
  'Harter Kalonia',
  'Has Obbit',
  'Hera Syndulla',
  'Hevy',
  'Hondo Ohnaka',
  'Huyang',
  'Iden Versio',
  'IG-88',
  'Ima-Gun Di',
  'Inquisitors',
  'Inspector Thanoth',
  'Jabba',
  'Jacen Syndulla',
  'Jan Dodonna',
  'Jango Fett',
  'Janus Greejatus',
  'Jar Jar Binks',
  'Jas Emari',
  'Jaxxon',
  'Jek Tono Porkins',
  'Jeremoch Colton',
  'Jira',
  'Jobal Naberrie',
  'Jocasta Nu',
  'Joclad Danva',
  'Joh Yowza',
  'Jom Barell',
  'Joph Seastriker',
  'Jova Tarkin',
  'Jubnuk',
  'Jyn Erso',
  'K-2SO',
  'Kanan Jarrus',
  'Karbin',
  'Karina the Great',
  'Kes Dameron',
  'Ketsu Onyo',
  'Ki-Adi-Mundi',
  'King Katuunko',
  'Kit Fisto',
  'Kitster Banai',
  'Klaatu',
  'Klik-Klak',
  'Korr Sella',
  'Kylo Ren',
  'L3-37',
  'Lama Su',
  'Lando Calrissian',
  'Lanever Villecham',
  'Leia Organa',
  'Letta Turmond',
  'Lieutenant Kaydel Ko Connix',
  'Lieutenant Thire',
  'Lobot',
  'Logray',
  'Lok Durd',
  'Longo Two-Guns',
  'Lor San Tekka',
  'Lorth Needa',
  'Lott Dod',
  'Luke Skywalker',
  'Lumat',
  'Luminara Unduli',
  'Lux Bonteri',
  'Lyn Me',
  'Lyra Erso',
  'Mace Windu',
  'Malakili',
  'Mama the Hutt',
  'Mars Guo',
  'Mas Amedda',
  'Mawhonic',
  'Max Rebo',
  'Maximilian Veers',
  'Maz Kanata',
  'ME-8D9',
  'Meena Tills',
  'Mercurial Swift',
  'Mina Bonteri',
  'Miraj Scintel',
  'Mister Bones',
  'Mod Terrik',
  'Moden Canady',
  'Mon Mothma',
  'Moradmin Bast',
  'Moralo Eval',
  'Morley',
  'Mother Talzin',
  'Nahdar Vebb',
  'Nahdonnis Praji',
  'Nien Nunb',
  'Niima the Hutt',
  'Nines',
  'Norra Wexley',
  'Nute Gunray',
  'Nuvo Vindi',
  'Obi-Wan Kenobi',
  'Odd Ball',
  'Ody Mandrell',
  'Omi',
  'Onaconda Farr',
  'Oola',
  'OOM-9',
  'Oppo Rancisis',
  'Orn Free Taa',
  'Oro Dassyne',
  'Orrimarko',
  'Osi Sobeck',
  'Owen Lars',
  'Pablo-Jill',
  'Padmé Amidala',
  'Pagetti Rook',
  'Paige Tico',
  'Paploo',
  'Petty Officer Thanisson',
  'Pharl McQuarrie',
  'Plo Koon',
  'Po Nudo',
  'Poe Dameron',
  'Poggle the Lesser',
  'Pong Krell',
  'Pooja Naberrie',
  'PZ-4CO',
  'Quarrie',
  'Quay Tolsite',
  'Queen Apailana',
  'Queen Jamillia',
  'Queen Neeyutnee',
  'Qui-Gon Jinn',
  'Quiggold',
  'Quinlan Vos',
  'R2-D2',
  'R2-KT',
  'R3-S6',
  'R4-P17',
  'R5-D4',
  'RA-7',
  'Rabé',
  'Rako Hardeen',
  'Ransolm Casterfo',
  'Rappertunie',
  'Ratts Tyerell',
  'Raymus Antilles',
  'Ree-Yees',
  'Reeve Panzoro',
  'Rey',
  'Ric Olié',
  'Riff Tamson',
  'Riley',
  'Rinnriyin Di',
  'Rio Durant',
  'Rogue Squadron',
  'Romba',
  'Roos Tarpals',
  'Rose Tico',
  'Rotta the Hutt',
  'Rukh',
  'Rune Haako',
  'Rush Clovis',
  'Ruwee Naberrie',
  'Ryoo Naberrie',
  'Sabé',
  'Sabine Wren',
  'Saché',
  'Saelt-Marae',
  'Saesee Tiin',
  'Salacious B. Crumb',
  'San Hill',
  'Sana Starros',
  'Sarco Plank',
  'Sarkli',
  'Satine Kryze',
  'Savage Opress',
  'Sebulba',
  'Senator Organa',
  'Sergeant Kreel',
  'Seventh Sister',
  'Shaak Ti',
  'Shara Bey',
  'Shmi Skywalker',
  'Shu Mai',
  'Sidon Ithano',
  'Sifo-Dyas',
  'Sim Aloo',
  'Siniir Rath Velus',
  'Sio Bibble',
  'Sixth Brother',
  'Slowen Lo',
  'Sly Moore',
  'Snaggletooth',
  'Snap Wexley',
  'Snoke',
  'Sola Naberrie',
  'Sora Bulq',
  'Strono Tuggs',
  'Sy Snootles',
  'Tallissan Lintra',
  'Tarfful',
  'Tasu Leech',
  'Taun We',
  'TC-14',
  'Tee Watt Kaa',
  'Teebo',
  'Teedo',
  'Teemto Pagalies',
  'Temiri Blagg',
  'Tessek',
  'Tey How',
  'Thane Kyrell',
  'The Bendu',
  'The Smuggler',
  'Thrawn',
  'Tiaan Jerjerrod',
  'Tion Medon',
  'Tobias Beckett',
  'Tulon Voidgazer',
  'Tup',
  'U9-C4',
  'Unkar Plutt',
  'Val Beckett',
  'Vanden Willard',
  'Vice Admiral Amilyn Holdo',
  'Vober Dand',
  'WAC-47',
  'Wag Too',
  'Wald',
  'Walrus Man',
  'Warok',
  'Wat Tambor',
  'Watto',
  'Wedge Antilles',
  'Wes Janson',
  'Wicket W. Warrick',
  'Wilhuff Tarkin',
  'Wollivan',
  'Wuher',
  'Wullf Yularen',
  'Xamuel Lennox',
  'Yaddle',
  'Yarael Poof',
  'Yoda',
  'Zam Wesell',
  'Zev Senesca',
  'Ziro the Hutt',
  'Zuckuss',
]

const autoSuggestMatcher = /(@|\[\[|\$)([\p{Letter}\d]*)$/u

function Leaf({
  attributes,
  children,
  leaf,
}: {
  attributes: any
  children: any
  leaf: CustomText
}): JSX.Element {
  let style: CSSProperties = {}

  // console.log(leaf)

  switch (leaf.type) {
    case 'sect-symbol': {
      style = { fontWeight: 'bold' }
      break
    }
    case 'multiline-marker':
    case 'inline-marker': {
      style = { color: 'red' }
      break
    }
    case 'inline-value':
    case 'line-value': {
      style = { color: 'blue' }
      break
    }
    case 'line-mark':
    case 'inline-mark': {
      style = { color: 'orange' }
      break
    }
    case 'ticker':
    case 'topic': {
      style = { color: 'brown' }
      break
    }
    case 'stamp': {
      style = { color: 'yellow' }
      break
    }
  }

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  )
}

function withShiftBreak(editor: CustomEditor) {
  /** 原本slate在換行時會創一個新node，改成以`\n`取代 */
  editor.insertBreak = () => {
    Editor.insertText(editor, '\n')
  }
  return editor
}

function insertMention(editor: CustomEditor, character: string): void {
  // const mention: MentionElement = {
  //   type: 'mention',
  //   character,
  //   children: [{ text: '' }],
  // }
  // Transforms.insertNodes(editor, mention)
  // Transforms.move(editor)
  Transforms.insertText(editor, character)
  // Transforms.move(editor)
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    // children: [{ text: '$AAA\n[a]some words with [[BBB]]...' }],
    children: [{ text: '[[BBB\nCCC]]\n...' }],
  },
]

function fuzzySearch(term: string): string[] {
  const chars = CHARACTERS.filter((c) =>
    c.toLowerCase().startsWith(term.toLowerCase())
  ).slice(0, 10)

  return chars
}

function Portal({ children }: { children: ReactNode }): JSX.Element | null {
  return typeof document === 'object'
    ? createPortal(children, document.body)
    : null
}

function AutoSuggest({
  // ref,
  // top,
  // left,
  corner,
  suggestions,
  selectedIdx,
  setSelectedIdx,
  onSelected,
}: {
  // ref: React.RefObject<HTMLDivElement>
  // top?: string
  // left?: string
  corner?: { top: string; left: string }
  suggestions: string[] | null
  selectedIdx: number | null
  setSelectedIdx: (a: number | null) => void
  onSelected: (
    event: React.KeyboardEvent | React.MouseEvent,
    selectedTerm: string
  ) => void
}): JSX.Element | null {
  if (suggestions === null) return null
  return (
    <div
      // ref={ref}
      style={{
        top: corner?.top ?? '-9999px',
        left: corner?.left ?? '-9999px',
        position: 'absolute',
        zIndex: 1,
        padding: '3px',
        background: 'white',
        borderRadius: '4px',
        boxShadow: '0 1px 5px rgba(0,0,0,.2)',
      }}
    >
      {suggestions.map((e, i) => (
        <div
          key={i}
          style={{
            padding: '1px 3px',
            borderRadius: '3px',
            background: i === selectedIdx ? '#B4D5FF' : 'transparent',
          }}
          onMouseEnter={(event) => {
            event.preventDefault()
            setSelectedIdx(i)
          }}
          onMouseLeave={(event) => {
            event.preventDefault()
            setSelectedIdx(0)
          }}
          onMouseDown={(event) => {
            event.preventDefault()
          }}
          onMouseUp={(event) => {
            onSelected(event, e)
          }}
        >
          {e}
        </div>
      ))}
    </div>
  )
}

function decorate([node, path]: NodeEntry): Range[] {
  const ranges: Range[] = []

  if (!Text.isText(node)) return ranges

  const cardEditor = new CardEditor(
    undefined,
    undefined,
    'http://test2.com',
    'test-oauther'
  )
  cardEditor.setText(node.text)
  cardEditor.flush()
  const sections = cardEditor.getSections()

  function pushStream(stream: ExtTokenStream, start: number): number {
    let length = 0
    if (typeof stream === 'string') {
      length = stream.length
    } else if (Array.isArray(stream)) {
      for (const e of stream) {
        const l = pushStream(e, start)
        start += l
        length += l
      }
    } else {
      // length = getLength(stream)
      // length = pushStream(stream, start)
      // stream.content
      const content = streamToStr(stream.content)
      length = content.length
      ranges.push({
        type: stream.type,
        anchor: { path, offset: start },
        focus: { path, offset: start + length },
      })
      pushStream(stream.content, start)
    }

    return length
  }

  let start = 0

  for (const sect of sections) {
    if (sect.stream) {
      const length = pushStream(sect.stream, start)
      start += length
    }
  }

  return ranges
}

function SlateEditor(): JSX.Element {
  const editor = useMemo(
    () => withShiftBreak(withHistory(withReact(createEditor()))),
    []
  )
  const [value, setValue] = useState<Descendant[]>(initialValue)

  // auto complete
  const [search, setSearch] =
    useState<{ trigger: '@' | '[[' | '$'; term: string; range: Range } | null>(
      null
    )
  const [suggestions, setSuggestions] = useState<string[] | null>(null)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [corner, setCorner] = useState<{ top: string; left: string }>()

  const onSelected = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent, selectedTerm: string) => {
      console.log('onSelected')
      console.log(search)
      if (search) {
        event.preventDefault()
        Transforms.select(editor, search.range)
        // insertMention(editor, chars[index])
        insertMention(editor, `${search.trigger}${selectedTerm}`)
        setSearch(null)
      } else {
        setSearch(null)
      }
    },
    [search]
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (search) {
        switch (event.key) {
          case 'ArrowDown': {
            event.preventDefault()
            if (selectedIdx !== null) {
              // const prevIndex = selectedIdx >= chars.length - 1 ? 0 : selectedIdx + 1
              setSelectedIdx(selectedIdx + 1)
            } else {
              setSelectedIdx(0)
            }
            break
          }
          case 'ArrowUp': {
            event.preventDefault()
            // const nextIndex =
            //   selectedIdx <= 0 ? chars.length - 1 : selectedIdx - 1
            // setSelectedIdx(nextIndex)
            if (selectedIdx !== null) {
              setSelectedIdx(selectedIdx - 1)
            } else {
              setSelectedIdx(0)
            }
            break
          }
          case 'Tab':
            // case 'Enter':
            console.log(suggestions, selectedIdx)
            if (suggestions !== null && selectedIdx !== null) {
              onSelected(event, suggestions[selectedIdx])
            }
            // if (searchTerm) {
            //   onSelected(event, searchTerm)
            // }
            // event.preventDefault()
            // Transforms.select(editor, target)
            // insertMention(editor, chars[index])
            // setTarget(null)
            break
          case 'Escape':
            event.preventDefault()
            setSearch(null)
            break
        }
      }
    },
    // [selectedIdx, search, target]
    [selectedIdx, search]
  )

  useEffect(() => {
    if (search) {
      const domRange = ReactEditor.toDOMRange(editor, search.range)
      const rect = domRange.getBoundingClientRect()
      setCorner({
        top: `${rect.top + window.pageYOffset + 24}px`,
        left: `${rect.left + window.pageXOffset}px`,
      })
      setSuggestions(fuzzySearch(search.term))
    }
  }, [editor, search])

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(value) => {
        setValue(value)
        const { selection } = editor

        if (selection && Range.isCollapsed(selection)) {
          const [cur] = Range.edges(selection)

          // 從目前輸入點的行頭至輸入點之間，搜尋最後一個trigger符號
          // const wordBefore = Editor.before(editor, start, { unit: 'word' })
          // const before = wordBefore && Editor.before(editor, wordBefore)
          const start = Editor.before(editor, cur, { unit: 'block' })
          const startRange = start && Editor.range(editor, start, cur)
          const startText = startRange && Editor.string(editor, startRange)
          const startMatch =
            startText && startText.split('\n').pop()?.match(autoSuggestMatcher)
          // const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/)

          // 若是在句中插入的情況，需要找break-point
          // const after = Editor.after(editor, start)
          // const afterRange = Editor.range(editor, start, after)
          // const afterText = Editor.string(editor, afterRange)
          // const afterMatch = afterText.match(/^(\s|$)/)

          // console.log('-------')
          // console.log(before, beforeRange, beforeText, beforeMatch)
          // console.log(after, afterRange, afterText)
          // console.log(beforeMatch, afterMatch)

          if (startMatch && ['$', '[[', '@'].includes(startMatch[1])) {
            const searchStart = Editor.before(editor, cur, {
              distance: startMatch[0].length,
              unit: 'offset',
            })
            const searchRange =
              searchStart && Editor.range(editor, searchStart, cur)
            console.log(searchRange)
            if (searchRange) {
              setSearch({
                trigger: startMatch[1] as '$' | '[[' | '@',
                term: startMatch[2],
                range: searchRange,
              })
              setSelectedIdx(0)
            }

            return
          }
        }

        setSearch(null)
      }}
    >
      <Editable
        autoCorrect="false"
        decorate={decorate}
        onKeyDown={onKeyDown}
        placeholder="Write some markdown..."
        renderLeaf={(props) => <Leaf {...props} />}
      />
      {search && (
        <Portal>
          <AutoSuggest
            corner={corner}
            suggestions={suggestions}
            selectedIdx={selectedIdx}
            setSelectedIdx={setSelectedIdx}
            onSelected={onSelected}
          />
        </Portal>
      )}
    </Slate>
  )
}

export function EditorPage(): JSX.Element {
  return (
    <div>
      <SlateEditor />
    </div>
  )
}

export default EditorPage
