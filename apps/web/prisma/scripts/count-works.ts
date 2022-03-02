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
import { Author, Card, CardState, Link, PrismaClient, Rate, RateChoice, Sym } from '@prisma/client'

const keepLastOneOnly = (states: CardState[]) => {
  states.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  const set = new Set<string>()
  const filtered: CardState[] = []
  states.forEach(e => {
    if (!set.has(e.cardId)) {
      set.add(e.cardId)
      filtered.push(e)
    }
  })
  return filtered
}

type CardStateRow = {
  id: string
  cardId: string
  commitId: string
  userId: string
  body: string
  prevId: string
  createdAt: string
  updatedAt: string
}

const cardStates: CardState[] = []

parseFile<CardStateRow, CardState>(resolve(process.cwd(), process.argv[2]), { headers: true, encoding: 'utf8' })
  .transform((data: CardStateRow): CardState => {
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
  .on('data', (row: CardState) => {
    // console.log(row)
    cardStates.push(row)
  })
  .on('end', (rowCount: number) => {
    console.log(`Parsed ${rowCount} rows`)
  })
