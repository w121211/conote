import Link from 'next/link'
import React, { Children, useContext, useEffect, useState } from 'react'
import Select, {
  ControlProps,
  components,
  SingleValueProps,
  GroupBase,
  SingleValue,
  OptionProps,
} from 'react-select'
import {
  NoteDocFragment,
  NoteDraftFragment,
  NoteFragment,
  useNoteDocsToMergeByNoteQuery,
} from '../../apollo/query.graphql'
import { getNotePageURL } from '../utils'
import { DropdownListItem } from '../ui-component/dropdown-list-item'
import { ListItem } from '../ui-component/list-item'
import ToggleMenu from '../ui-component/toggle-menu'
import { DomainType } from './domain'
import { DomainContext } from './domain-context'

const mockData = ['main', 'test1', 'test2']

const DomainSelect = ({
  cur,
  note,
  noteDraft,
}: {
  cur: NoteDocFragment | NoteDraftFragment | null
  note: NoteFragment
  noteDraft: NoteDraftFragment | null
}) => {
  // const [candidate, setCandidate] = useState('main')
  // const { symbol } = note.sym,
  //   qDocsToMerge = useNoteDocsToMergeByNoteQuery({
  //     variables: { noteId: note.id },
  //   }),
  //   [hide, setHide] = useState(true)
  // let curLabel = ''
  // if (cur === null || cur.__typename === 'NoteDraft') {
  //   curLabel = 'Draft'
  // } else if (cur.__typename === 'NoteDoc') {
  //   curLabel = cur.id === note.headDoc.id ? 'Head' : cur.id.slice(-6)
  // }
  // const onClick = () => {
  //   setHide(!hide)
  // }
  // return (
  //   <ToggleMenu summary={<span className="btn-primary">{curLabel}</span>}>
  //     <ul>
  //       {noteDraft && (
  //         <DropdownListItem>
  //           <Link href={getNotePageURL('edit', symbol)}>
  //             <a>Draft</a>
  //           </Link>
  //         </DropdownListItem>
  //       )}
  //       {note && (
  //         <DropdownListItem>
  //           <Link href={getNotePageURL('view', symbol)}>
  //             <a>Head</a>
  //           </Link>
  //         </DropdownListItem>
  //       )}
  //       {qDocsToMerge.data &&
  //         qDocsToMerge.data.noteDocsToMergeByNote.map(e => (
  //           <DropdownListItem key={e.id}>
  //             <Link href={getNotePageURL('doc', symbol, e.id)}>
  //               <a href="#">#{e.id.slice(-6)}</a>
  //             </Link>
  //           </DropdownListItem>
  //         ))}
  //     </ul>
  //   </ToggleMenu>
  // <Select
  //   value={value}
  //   onChange={onChange}
  //   options={branchOptions}
  //   isSearchable={false}
  //   //   menuIsOpen
  //   styles={{
  //     // container: base => ({ ...base, flexGrow: 1 }),
  //     control: base => ({
  //       ...base,
  //       width: 'fit-content',
  //       height: 'fit-content',
  //       minHeight: 'fit-content',
  //       boxShadow: 'none',
  //     }),
  //     menu: base => ({
  //       ...base,
  //       width: 'fit-content',
  //       // fontSize: '12px',
  //     }),
  //     option: base => ({
  //       ...base,
  //       paddingTop: '2px',
  //       paddingBottom: '2px',
  //       cursor: 'pointer',
  //     }),
  //     // singleValue: base => ({ ...base, color: 'rgb(107 114 128)' }),
  //     valueContainer: base => ({
  //       ...base,
  //       padding: 0,
  //     }),
  //     // dropdownIndicator: (base, state) => ({
  //     //   ...base,
  //     //   display: 'flex',
  //     //   padding: '0px ',
  //     //   color: 'white',
  //     //   ':hover': { color: 'white' },
  //     //   // transform: 'scale(0.7)',
  //     // }),
  //     // indicatorsContainer: base => ({ ...base, transform: 'scale(0.6)' }),
  //   }}
  //   components={{
  //     IndicatorSeparator: null,
  //     Control: ControlComponent,
  //     SingleValue: SingleValueComponent,
  //     DropdownIndicator: null,
  //     // Option: OptionComponent,
  //   }}
  // />
  // )
}

export default DomainSelect
