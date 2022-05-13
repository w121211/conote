import { NoteDraftInput as GQLNoteDraftInput } from 'graphql-let/__generated__/__types__'
import { GQLNoteDraft, GQLNoteDraftEntry } from '../interfaces'
import {
  mockGotDraftOnly,
  mockGotNoteAndDraft,
  mockMyAllDrafts,
} from '../../test/__mocks__/mock-data'
import {
  MyNoteDraftEntriesDocument,
  MyNoteDraftEntriesQuery,
  MyNoteDraftEntriesQueryVariables,
  NoteDraftDocument,
  NoteDraftQuery,
  NoteDraftQueryVariables,
} from '../../../../apollo/query.graphql'
import { getApolloClient } from '../../../../apollo/apollo-client'

interface INoteDraftService {
  queryDraft(symbol: string): Promise<GQLNoteDraft | null>

  queryMyAllDrafts(): Promise<Partial<GQLNoteDraftEntry>[] | null>

  saveDraft(draftInput: GQLNoteDraftInput, id?: string): Promise<GQLNoteDraft>

  removeDraft(id: string): Promise<{ success: true }>
}

class MockNoteDraftService implements INoteDraftService {
  async queryDraft(symbol: string): Promise<GQLNoteDraft | null> {
    // throw new Error('not implemented')
    let draft: GQLNoteDraft | undefined
    switch (symbol) {
      case mockGotDraftOnly.title:
        draft = mockGotDraftOnly.draft
        break
      case mockGotNoteAndDraft.title:
        draft = mockGotNoteAndDraft.draft
        break
    }
    return draft ?? null
  }

  async queryMyAllDrafts(): Promise<Partial<GQLNoteDraftEntry>[] | null> {
    // throw new Error('not implemented')
    return mockMyAllDrafts
  }

  async saveDraft(
    draftInput: GQLNoteDraftInput,
    id?: string,
  ): Promise<GQLNoteDraft> {
    throw new Error('not implemented')
  }

  async removeDraft(id: string): Promise<{ success: true }> {
    throw new Error('not implemented')
  }
}

/**
 *
 */
class NoteDraftService implements INoteDraftService {
  private apolloClient = getApolloClient()

  async queryDraft(symbol: string): Promise<GQLNoteDraft | null> {
    const { data, errors } = await this.apolloClient.query<
      NoteDraftQuery,
      NoteDraftQueryVariables
    >({
      query: NoteDraftDocument,
      variables: { symbol },
    })

    if (errors) {
      console.debug('[NoteDraftQuery] error', errors)
      return null
    }
    if (data.noteDraft) {
      return data.noteDraft
    }
    return null
  }

  async queryMyAllDrafts(): Promise<Partial<GQLNoteDraftEntry>[] | null> {
    const { data, errors } = await this.apolloClient.query<
      MyNoteDraftEntriesQuery,
      MyNoteDraftEntriesQueryVariables
    >({
      query: MyNoteDraftEntriesDocument,
    })

    if (errors) {
      console.debug('[NoteDraftQuery] error', errors)
      return null
    }
    if (data.myNoteDraftEntries) {
      return data.myNoteDraftEntries
    }
    return null
  }

  async saveDraft(
    draftInput: GQLNoteDraftInput,
    id?: string,
  ): Promise<GQLNoteDraft> {
    throw new Error('not implemented')
  }

  async removeDraft(id: string): Promise<{ success: true }> {
    throw new Error('not implemented')
  }
}

/**
 *
 */
export function getNoteDraftService(mock?: true): INoteDraftService {
  if (mock) {
    return new MockNoteDraftService()
  }
  return new NoteDraftService()
}
