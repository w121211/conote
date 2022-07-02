import type {
  NoteDraftInput,
  NoteDraftMetaInput,
} from 'graphql-let/__generated__/__types__'
import { Block, Doc } from '../interfaces'
import {
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
} from '../../../../apollo/query.graphql'
import { getApolloClient } from '../../../../apollo/apollo-client'
import { docRepo } from '../stores/doc.repository'
import { omitTypenameDeep } from '../utils'
import { FetchPolicy } from '@apollo/client'
import { nanoid } from 'nanoid'
import { parseGQLBlocks } from '../../../../shared/block.common'

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

    const { data, errors } = await this.apolloClient.mutate<
      CreateNoteDraftMutation,
      CreateNoteDraftMutationVariables
    >({
      mutation: CreateNoteDraftDocument,
      variables: { branch, symbol, data: input },
    })

    if (data?.createNoteDraft) {
      return data.createNoteDraft
    }
    if (errors) {
      console.error(errors)
      throw new Error('[createDraft] mutation error')
    }
    throw new Error('[createDraft] no return data')
  }

  /**
   *
   */
  async deleteDraft(id: string): Promise<boolean> {
    const { data, errors } = await this.apolloClient.mutate<
      DeleteNoteDraftMutation,
      DeleteNoteDraftMutationVariables
    >({
      mutation: DeleteNoteDraftDocument,
      variables: { id },
    })
    if (data) {
      return data.deleteNoteDraft
    }
    if (errors) {
      console.error(errors)
      throw new Error('[deleteDraft] DropNoteDraftMutation error')
    }
    throw new Error('[deleteDraft] no return data')
  }

  /**
   *
   */
  async dropDraft(id: string): Promise<NoteDraftDropResponseFragment> {
    const { data, errors } = await this.apolloClient.mutate<
      DropNoteDraftMutation,
      DropNoteDraftMutationVariables
    >({
      mutation: DropNoteDraftDocument,
      variables: { id },
    })
    if (data?.dropNoteDraft) {
      return data.dropNoteDraft
    }
    if (errors) {
      console.error(errors)
      throw new Error('[dropDraft] DropNoteDraftMutation error')
    }
    throw new Error('[dropDraft] no return data')
  }

  /**
   *
   */
  async queryDraft(symbol: string): Promise<NoteDraftFragment | null> {
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
    // if (errors) {
    //   console.debug(errors)
    //   throw new Error('[queryMyAllDrafts] Graphql error')
    // }
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
    const { data, errors } = await this.apolloClient.mutate<
      UpdateNoteDraftMutation,
      UpdateNoteDraftMutationVariables
    >({
      mutation: UpdateNoteDraftDocument,
      variables: { id, data: input, newSymbol },
    })
    if (data?.updateNoteDraft) {
      return data.updateNoteDraft
    }
    if (errors) {
      console.error(errors)
      throw new Error('[updateDraft] mutation error')
    }
    throw new Error('[updateDraft] no return data')
  }

  /**
   *
   */
  async updateDraftMeta(
    id: string,
    input: NoteDraftMetaInput,
  ): Promise<NoteDraftFragment> {
    const { data, errors } = await this.apolloClient.mutate<
      UpdateNoteDraftMetaMutation,
      UpdateNoteDraftMetaMutationVariables
    >({
      mutation: UpdateNoteDraftMetaDocument,
      variables: { id, data: input },
    })
    if (data?.updateNoteDraftMeta) {
      return data.updateNoteDraftMeta
    }
    if (errors) {
      console.error(errors)
      throw new Error('[updateDraftMeta] mutation error')
    }
    throw new Error('[updateDraftMeta] no return data')
  }

  /**
   * Remove '__typename' from query data
   */
  toDoc(
    branch: string,
    noteDraft: NoteDraftFragment,
    note: NoteFragment | null,
  ): { doc: Doc; blocks: Block[]; docBlock: Block } {
    const {
        symbol,
        domain,
        contentBody: { blocks: gqlBlocks, ...restContentBody },
        contentHead,
      } = noteDraft,
      { blocks, docBlock } = parseGQLBlocks(gqlBlocks),
      doc: Doc = {
        uid: nanoid(),
        branch,
        domain,
        symbol,
        contentHead: omitTypenameDeep(contentHead),
        contentBody: restContentBody,
        blockUid: docBlock.uid,
        noteCopy: note ?? undefined,
        noteDraftCopy: noteDraft,
      }
    return { doc, blocks, docBlock }
  }
}

export const noteDraftService = new NoteDraftService()
