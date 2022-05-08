import { Link, Note, Sym, SymType } from '@prisma/client'
import { NoteMetaInput as GQLNoteMetaInput } from 'graphql-let/__generated__/__types__'
import { FetchClient } from '../fetcher/fetch-client'
import prisma from '../prisma'
import { NoteStateModel, NoteStateParsed } from './note-state-model'
import { linkModel } from './link-model'
import { SymModel } from './sym-model'

export type NotePrarsed = Omit<Note, 'meta'> & {
  meta: NoteMeta
  sym: Sym
  state: NoteStateParsed | null
  link: Link | null
}

export type PrismaNote = Note & {
  sym: Sym
  link: Link | null
}

export const NoteModel = {
  async get(id: string): Promise<null | NotePrarsed> {
    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        link: true,
        sym: true,
      },
    })
    if (note) {
      return {
        ...note,
        meta: note.meta as unknown as NoteMeta,
        state: await NoteStateModel.getLastNoteState(note.id),
      }
    }
    return null
  },

  /**
   * Get note by symbol
   *
   * @throw symbol parse error
   */
  async getBySymbol(symbol: string): Promise<NotePrarsed | null> {
    const parsed = SymModel.parse(symbol)
    const sym = await prisma.sym.findUnique({
      where: { symbol: parsed.symbol },
      include: { note: { include: { link: true } } },
    })
    if (sym?.note) {
      const { note, ...restSym } = sym
      const state = await NoteStateModel.getLastNoteState(note.id)
      // if (state === null) {
      //   throw '[conote-web] symbol-note state cannot be null'
      // }
      return {
        ...note,
        meta: note.meta as unknown as NoteMeta,
        state,
        sym: restSym,
      }
    }
    return null
  },

  /**
   * Get or create a webpage-note by URL
   * If the given URL not found in database, try to scrape and then store.
   * Newly created webpage-note does not have note-state.
   *
   */
  async getOrCreateByUrl({
    scraper,
    url,
  }: {
    scraper?: FetchClient
    url: string
  }): Promise<NotePrarsed & { link: Link }> {
    const [link, { fetchResult }] = await LinkService.getOrCreateLink({
      scraper,
      url,
    })
    if (link.note) {
      const { note, ...linkRest } = link
      return {
        ...note,
        link: linkRest,
        meta: note.meta as unknown as NoteMeta,
        state: await NoteStateModel.getLastNoteState(note.id),
      }
    }

    // Note not found, create one
    const symbol = LinkService.toSymbol(link)
    const meta: NoteMeta = {
      author: fetchResult?.authorName,
      // description: fetchResult?.description,
      keywords: fetchResult?.keywords,
      publishedAt: fetchResult?.date,
      // template: 'webpage',
      tickers: fetchResult?.tickers,
      title: fetchResult?.title,
      url: link.url,
    }
    const note = await prisma.note.create({
      data: {
        link: { connect: { id: link.id } },
        meta,
        sym: {
          create: {
            type: SymType.URL,
            symbol,
          },
        },
      },
      include: { sym: true },
    })
    return {
      ...note,
      link,
      meta,
      state: null,
    }
  },

  parse(
    note: PrismaNote,
    noteState: NoteStateParsed | null = null,
  ): NotePrarsed {
    const { link, sym } = note
    return {
      ...note,
      meta: note.meta as unknown as NoteMeta,
      state: noteState,
      sym,
      link,
    }
  },

  async udpateNoteSymbol(id: string, newSymbol: string): Promise<NotePrarsed> {
    const note = await this.get(id)
    if (note === null) {
      throw 'note not found'
    }
    if (note.sym.symbol === newSymbol) {
      return note
    }
    const sym = await SymModel.update(note.symId, newSymbol)
    return {
      ...note,
      sym,
    }
  },

  async udpateNoteMeta(
    id: string,
    newNoteMeta: GQLNoteMetaInput,
  ): Promise<NotePrarsed> {
    const newNote = await prisma.note.update({
      data: { meta: newNoteMeta },
      include: {
        link: true,
        sym: true,
      },
      where: { id },
    })

    return this.parse(newNote)
  },
}
