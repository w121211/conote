import type { FetchPolicy } from '@apollo/client'
import type {
  NoteDraftInput,
  NoteDraftMetaInput,
} from 'graphql-let/__generated__/__types__'
import {
  CreateNoteDraftByLinkDocument,
  CreateNoteDraftByLinkMutation,
  CreateNoteDraftByLinkMutationVariables,
  CreateNoteDraftDocument,
  CreateNoteDraftMutation,
  CreateNoteDraftMutationVariables,
  DeleteNoteDraftDocument,
  DeleteNoteDraftMutation,
  DeleteNoteDraftMutationVariables,
  DropNoteDraftDocument,
  DropNoteDraftMutation,
  DropNoteDraftMutationVariables,
  MyNoteDraftEntriesDocument,
  MyNoteDraftEntriesQuery,
  MyNoteDraftEntriesQueryVariables,
  NoteDraftDocument,
  NoteDraftDropResponseFragment,
  NoteDraftFragment,
  NoteDraftQuery,
  NoteDraftQueryVariables,
  NoteFragment,
  UpdateNoteDraftDocument,
  UpdateNoteDraftMetaDocument,
  UpdateNoteDraftMetaMutation,
  UpdateNoteDraftMetaMutationVariables,
  UpdateNoteDraftMutation,
  UpdateNoteDraftMutationVariables,
} from '../../../../../apollo/query.graphql'
import { getApolloClient } from '../../../../../apollo/apollo-client'
import { parseGQLBlocks } from '../../../../../share/utils'
import type { Block, Doc } from '../interfaces'
import { genDocUid, omitTypenameDeep } from '../utils'

/**
 *
 */
class NoteDraftService {
  private apolloClient = getApolloClient()

  /**
   *
   */
  async createDraft(
    branch: string,
    symbol: string,
    input: NoteDraftInput,
  ): Promise<NoteDraftFragment> {
    // console.log(branch, symbol, input)

    const { data } = await this.apolloClient.mutate<
      CreateNoteDraftMutation,
      CreateNoteDraftMutationVariables
    >({
      mutation: CreateNoteDraftDocument,
      variables: { branch, symbol, data: input },
    })

    if (data?.createNoteDraft) {
      return data.createNoteDraft
    }
    throw new Error('[createDraft] No return data')
  }

  async createDraftByLink(
    branch: string,
    linkId: string,
    input: NoteDraftInput,
  ): Promise<NoteDraftFragment> {
    // console.log(branch, symbol, input)

    const { data } = await this.apolloClient.mutate<
      CreateNoteDraftByLinkMutation,
      CreateNoteDraftByLinkMutationVariables
    >({
      mutation: CreateNoteDraftByLinkDocument,
      variables: { branch, linkId, data: input },
    })

    if (data?.createNoteDraftByLink) {
      return data.createNoteDraftByLink
    }
    throw new Error('[createDraftByLink] No return data')
  }

  /**
   *
   */
  async deleteDraft(id: string): Promise<boolean> {
    const { data } = await this.apolloClient.mutate<
      DeleteNoteDraftMutation,
      DeleteNoteDraftMutationVariables
    >({
      mutation: DeleteNoteDraftDocument,
      variables: { id },
    })
    if (data) {
      return data.deleteNoteDraft
    }
    throw new Error('[deleteDraft] No return data')
  }

  /**
   *
   */
  async dropDraft(id: string): Promise<NoteDraftDropResponseFragment> {
    const { data } = await this.apolloClient.mutate<
      DropNoteDraftMutation,
      DropNoteDraftMutationVariables
    >({
      mutation: DropNoteDraftDocument,
      variables: { id },
    })
    if (data?.dropNoteDraft) {
      return data.dropNoteDraft
    }
    throw new Error('[dropDraft] No return data')
  }

  /**
   *
   */
  async queryDraft(
    symbol: string,
    fetchPolicy?: FetchPolicy,
  ): Promise<NoteDraftFragment | null> {
    const { data } = await this.apolloClient.query<
      NoteDraftQuery,
      NoteDraftQueryVariables
    >({
      query: NoteDraftDocument,
      variables: { symbol },
      fetchPolicy,
    })

    if (data.noteDraft) {
      return data.noteDraft
    }
    return null
  }

  /**
   *
   */
  async queryMyAllDraftEntries(
    fetchPolicy?: FetchPolicy,
  ): Promise<MyNoteDraftEntriesQuery['myNoteDraftEntries']> {
    const { data } = await this.apolloClient.query<
      MyNoteDraftEntriesQuery,
      MyNoteDraftEntriesQueryVariables
    >({
      query: MyNoteDraftEntriesDocument,
      fetchPolicy,
    })
    if (data.myNoteDraftEntries) {
      return data.myNoteDraftEntries
    }
    throw new Error('[queryMyAllDrafts] No return data')
  }

  /**
   *
   */
  async updateDraft(
    id: string,
    input: NoteDraftInput,
    newSymbol?: string,
  ): Promise<NoteDraftFragment> {
    // console.log('updateDraft')
    const { data } = await this.apolloClient.mutate<
      UpdateNoteDraftMutation,
      UpdateNoteDraftMutationVariables
    >({
      mutation: UpdateNoteDraftDocument,
      variables: { id, data: input, newSymbol },
    })
    if (data?.updateNoteDraft) {
      return data.updateNoteDraft
    }
    throw new Error('[updateDraft] No return data')
  }

  /**
   *
   */
  async updateDraftMeta(
    id: string,
    input: NoteDraftMetaInput,
  ): Promise<NoteDraftFragment> {
    const { data } = await this.apolloClient.mutate<
      UpdateNoteDraftMetaMutation,
      UpdateNoteDraftMetaMutationVariables
    >({
      mutation: UpdateNoteDraftMetaDocument,
      variables: { id, data: input },
    })
    if (data?.updateNoteDraftMeta) {
      return data.updateNoteDraftMeta
    }
    throw new Error('[updateDraftMeta] No return data')
  }

  /**
   * Remove '__typename' from query data
   * @returns blocks, include the docBlock
   * @returns docBlock
   */
  toDoc(
    draft: NoteDraftFragment,
    note: NoteFragment | null,
  ): { doc: Doc; blocks: Block[]; docBlock: Block } {
    const {
        contentBody: { blocks: gqlBlocks, ...restContentBody },
        contentHead,
      } = draft,
      { blocks, docBlock } = parseGQLBlocks(gqlBlocks),
      doc: Doc = {
        uid: genDocUid(),
        contentHead: omitTypenameDeep(contentHead),
        contentBody: restContentBody,
        blockUid: docBlock.uid,
        noteCopy: note ?? null,
        noteDraftCopy: draft,
      }
    return { doc, blocks, docBlock }
  }
}

export const noteDraftService = new NoteDraftService()
