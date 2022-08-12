import React from 'react'
import { NoteDocFragment } from '../../../apollo/query.graphql'
import { NoteList } from '../ui/note-list'

const UserNoteTable = ({ data }: { data: NoteDocFragment[] }) => {
  return <NoteList data={data} />
}

export default UserNoteTable
