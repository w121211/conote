import moment from 'moment'
import React from 'react'
import { TableData } from '../author/author-rate-table'
import { NoteData, NoteList } from '../ui-component/note-list'

const UserNoteTable = ({ data }: { data: NoteData[] }) => {
  return <NoteList data={data} />
}

export default UserNoteTable
