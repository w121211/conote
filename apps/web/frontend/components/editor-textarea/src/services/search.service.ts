import { SymType } from 'graphql-let/__generated__/__types__'
import { getApolloClient } from '../../../../../apollo/apollo-client'
import {
  SearchDiscussDocument,
  SearchDiscussQuery,
  SearchDiscussQueryVariables,
  SearchHitFragment,
  SearchSymbolDocument,
  SearchSymbolQuery,
  SearchSymbolQueryVariables,
} from '../../../../../apollo/query.graphql'
import { Search } from '../interfaces'

let searchService: SearchService | undefined

class SearchService {
  private apolloClient = getApolloClient()

  async searchAuthor(term: string): Promise<SearchHitFragment[]> {
    throw new Error('not implemented')
  }

  async searchDiscuss(term: string): Promise<SearchHitFragment[]> {
    const { data, errors } = await this.apolloClient.query<
      SearchDiscussQuery,
      SearchDiscussQueryVariables
    >({
      query: SearchDiscussDocument,
      variables: { term },
    })

    if (errors) {
      console.error('[SearchDiscussQuery] error', errors)
      throw new Error('[SearchDiscussQuery] error')
    }
    if (data.searchDiscuss) {
      return data.searchDiscuss
    }
    return []
  }

  async searchSymbol(
    term: string,
    type: SymType,
  ): Promise<SearchHitFragment[]> {
    const { data, errors } = await this.apolloClient.query<
      SearchSymbolQuery,
      SearchSymbolQueryVariables
    >({
      query: SearchSymbolDocument,
      variables: { term, type },
    })

    if (errors) {
      console.error('[SearchSymbolQuery] error', errors)
      throw new Error('[SearchSymbolQuery] error')
    }
    if (data.searchSymbol) {
      return data.searchSymbol
    }
    return []
  }

  /**
   * Get hit by index, transforms to corresponding inline-str
   * If `hitClicked` is given, use it
   * If index is out of bound, return null
   *
   * @param hitClicked hit clicked by mouse
   */
  getAutoCompleteStr(
    search: Search,
    hitClicked?: SearchHitFragment,
  ): string | null {
    const { hits, hitIndex, type } = search,
      hit = hitClicked ?? (hitIndex !== null ? hits[hitIndex] : undefined)

    if (hit) {
      switch (type) {
        case 'discuss':
          return hit.str + '-' + hit.id
        case 'topic':
          // Remove '[[' and ']]'
          return hit.str.substring(2, hit.str.length - 2)
      }

      // const { note, discussTitle } = hit
      // if (note) {
      //   return note.symbol
      // } else if (discussTitle) {
      //   return discussTitle
      // }
    }
    return null
  }
}

export function getSearchService(): SearchService {
  if (searchService === undefined) {
    searchService = new SearchService()
  }
  return searchService
}
