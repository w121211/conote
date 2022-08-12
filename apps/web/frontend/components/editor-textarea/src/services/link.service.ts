import { getApolloClient } from '../../../../../apollo/apollo-client'
import {
  CreateLinkDocument,
  CreateLinkMutation,
  CreateLinkMutationVariables,
  LinkFragment,
  LinkQuery,
  LinkQueryVariables,
  NoteDraftDocument,
} from '../../../../../apollo/query.graphql'

/**
 *
 */
class LinkService {
  private apolloClient = getApolloClient()

  /**
   * Get or create a link
   */
  async createLink(url: string): Promise<LinkFragment> {
    const { data } = await this.apolloClient.mutate<
      CreateLinkMutation,
      CreateLinkMutationVariables
    >({
      mutation: CreateLinkDocument,
      variables: { url },
    })
    if (data?.createLink) {
      return data.createLink
    }
    throw new Error('[createLink] No return data')
  }

  /**
   *
   */
  async queryLink(url: string): Promise<LinkFragment | null> {
    const { data } = await this.apolloClient.query<
      LinkQuery,
      LinkQueryVariables
    >({
      query: NoteDraftDocument,
      variables: { url },
    })
    return data.link ?? null
  }
}

export const linkService = new LinkService()
