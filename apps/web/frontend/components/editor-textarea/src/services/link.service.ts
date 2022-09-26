import { getApolloClient } from '../../../../../apollo/apollo-client'
import {
  GetOrCreateLinkDocument,
  GetOrCreateLinkMutation,
  GetOrCreateLinkMutationVariables,
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
  async getOrCreateLink(url: string): Promise<LinkFragment> {
    const { data } = await this.apolloClient.mutate<
      GetOrCreateLinkMutation,
      GetOrCreateLinkMutationVariables
    >({
      mutation: GetOrCreateLinkDocument,
      variables: { url },
    })
    if (data?.getOrCreateLink) {
      return data.getOrCreateLink
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
