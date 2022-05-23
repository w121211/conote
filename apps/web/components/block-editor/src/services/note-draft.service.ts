import { TreeNodeBody, treeUtil } from '@conote/docdiff'
import { NoteDraftInput } from 'graphql-let/__generated__/__types__'
import { Block, Doc } from '../interfaces'
import {
  BlockFragment,
  CreateNoteDraftDocument,
  CreateNoteDraftMutation,
  CreateNoteDraftMutationVariables,
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
  UpdateNoteDraftMutation,
  UpdateNoteDraftMutationVariables,
} from '../../../../apollo/query.graphql'
import { getApolloClient } from '../../../../apollo/apollo-client'
import { docRepo } from '../stores/doc.repository'
import { omitTypenameDeep } from '../utils'

// interface INoteDraftService {
//   // Queries

//   queryDraft(symbol: string): Promise<GQLNoteDraft | null>

//   queryMyAllDrafts(): Promise<MyNoteDraftEntriesQuery['myNoteDraftEntries']>

//   // Mutations

//   createDraft(
//     branch: string,
//     symbol: string,
//     draftInput: NoteDraftInput,
//   ): Promise<GQLNoteDraft>

//   dropDraft(id: string): Promise<NoteDraftDropResponseFragment>

//   saveDraft(id: string, draftInput: NoteDraftInput): Promise<GQLNoteDraft>

//   // Helpers

//   toNoteDraftInput(doc: Doc): NoteDraftInput
// }

/**
 * Convert gql-blocks to blocks by
 * - validate root-block
 * - add children uids
 * - validate children uids
 * - validate is any orphan block
 *
 * @returns
 * - blocks: includes doc-block
 * - docBlock
 */
export function convertGQLBlocks(gqlBlocks: BlockFragment[]): {
  blocks: Block[]
  docBlock: Block
} {
  const nodes: TreeNodeBody<BlockFragment>[] = gqlBlocks.map(e => ({
    uid: e.uid,
    parentUid: e.parentUid ?? null,
    order: e.order,
    data: e,
  }))

  const root = treeUtil.buildFromList(nodes),
    nodes_ = treeUtil.toList(root),
    blocks: Block[] = nodes_.map(e => {
      const {
        data: { str, open, order, docTitle },
        uid,
        parentUid,
        childrenUids,
      } = e
      return {
        uid,
        str,
        open: open ?? undefined,
        order,
        docTitle: docTitle ?? undefined,
        parentUid,
        childrenUids,

        // TODO:
        // editTime?: number // TBC, consider to drop
      }
    }),
    docBlock = blocks.find(e => e.uid === root.uid)

  if (docBlock === undefined) {
    throw new Error('[convertGQLBlocks] docBlock === undefined')
  }

  treeUtil.validateList(nodes_)
  return { blocks, docBlock }
}

/**
 *
 */
class NoteDraftService {
  private apolloClient = getApolloClient()

  //
  // Queries
  //
  //
  //
  //

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
  async queryMyAllDraftEntries(): Promise<
    MyNoteDraftEntriesQuery['myNoteDraftEntries']
  > {
    const { data, errors } = await this.apolloClient.query<
      MyNoteDraftEntriesQuery,
      MyNoteDraftEntriesQueryVariables
    >({
      query: MyNoteDraftEntriesDocument,
    })
    if (data.myNoteDraftEntries) {
      return data.myNoteDraftEntries
    }
    if (errors) {
      console.debug(errors)
      throw new Error('[queryMyAllDrafts] Graphql error')
    }
    throw new Error('[queryMyAllDrafts] No return data')
  }

  //
  // Mutations
  //
  //
  //
  //

  /**
   *
   */
  async createDraft(
    branch: string,
    symbol: string,
    draftInput: NoteDraftInput,
  ): Promise<NoteDraftFragment> {
    const { data, errors } = await this.apolloClient.mutate<
      CreateNoteDraftMutation,
      CreateNoteDraftMutationVariables
    >({
      mutation: CreateNoteDraftDocument,
      variables: {
        branch,
        symbol,
        draftInput,
      },
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
      throw new Error('[dropDraft] mutation error')
    }
    throw new Error('[dropDraft] no return data')
  }

  /**
   *
   */
  async saveDraft(
    id: string,
    draftInput: NoteDraftInput,
  ): Promise<NoteDraftFragment> {
    const { data, errors } = await this.apolloClient.mutate<
      UpdateNoteDraftMutation,
      UpdateNoteDraftMutationVariables
    >({
      mutation: UpdateNoteDraftDocument,
      variables: {
        id,
        data: draftInput,
      },
    })
    if (data?.updateNoteDraft) {
      return data.updateNoteDraft
    }
    if (errors) {
      console.error(errors)
      throw new Error('[saveDraft] mutation error')
    }
    throw new Error('[saveDraft] no return data')
  }

  //
  // Helpers
  //
  //
  //
  //

  /**
   * Remove '__typename' from query data
   */
  toDoc(
    branch: string,
    noteDraft: NoteDraftFragment,
    note: NoteFragment | null,
  ): { doc: Doc; blocks: Block[]; docBlock: Block } {
    const { content, domain, meta, symbol } = noteDraft,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      { blocks, docBlock } = convertGQLBlocks(content.blocks),
      doc: Doc = {
        branch,
        domain,
        title: symbol,
        meta: omitTypenameDeep(meta),
        blockUid: docBlock.uid,
        noteCopy: note ?? undefined,
        noteDraftCopy: noteDraft,
      }

    return { doc, blocks, docBlock }
  }

  /**
   *
   */
  toNoteDraftInput(doc: Doc): NoteDraftInput {
    const { domain, noteCopy, meta } = doc,
      blocks = docRepo.getContentBlocks(doc),
      blocksWithoutChildrenUids = blocks.map(e => {
        const { childrenUids, editTime, ...rest } = e
        return { ...rest }
      }),
      input: NoteDraftInput = {
        content: {
          blocks: blocksWithoutChildrenUids,
          discussIds: [],
          symbols: [],
        },
        domain,
        fromDocId: noteCopy?.noteDoc.id,
        meta,
      }
    return input
  }
}

/**
 *
 */
export function getNoteDraftService(): NoteDraftService {
  return new NoteDraftService()
}
