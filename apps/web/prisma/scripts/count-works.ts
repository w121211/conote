/**
 * Run
 * ```
 * $ ts-node count-works filename.csv
 * ```
 */
import { inspect } from 'util'
import { createReadStream, readdirSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { format, parse, parseFile } from 'fast-csv'
import { Author, NoteState, Link, PrismaClient, Rate, RateChoice, Sym } from '@prisma/client'

const keepLastOneOnly = (states: NoteState[]) => {
  states.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  const set = new Set<string>()
  const filtered: NoteState[] = []
  states.forEach(e => {
    if (!set.has(e.noteId)) {
      set.add(e.noteId)
      filtered.push(e)
    }
  })
  return filtered
}

type CardStateRow = {
  id: string
  noteId: string
  commitId: string
  userId: string
  body: string
  prevId: string
  createdAt: string
  updatedAt: string
}

const cardStates: NoteState[] = []

parseFile<CardStateRow, NoteState>(resolve(process.cwd(), process.argv[2]), { headers: true, encoding: 'utf8' })
  .transform((data: CardStateRow): NoteState => {
    // console.log(data)
    return {
      ...data,
      prevId: data.prevId === 'null' ? data.prevId : null,
      body: JSON.parse(data.body),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    }
  })
  .on('error', error => console.error(error))
  .on('data', (row: NoteState) => {
    // console.log(row)
    cardStates.push(row)
  })
  .on('end', (rowCount: number) => {
    console.log(`Parsed ${rowCount} rows`)
  })
