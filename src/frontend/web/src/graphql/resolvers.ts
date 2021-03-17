import { ApolloCache, Resolvers, gql } from '@apollo/client'
import Cookies from 'js-cookie'
import * as queries from './queries'
import * as QT from './query-types'

type ResolverFn = (parent: any, args: any, { cache }: { cache: ApolloCache<any> }) => any

interface ResolverMap {
  [field: string]: ResolverFn
}

interface AppResolvers extends Resolvers {
  Query: ResolverMap
  // Post: ResolverMap
  Comment: ResolverMap
}

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }
  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [ID!]!
  }
  # extend type Post {
  #   mePost: Boolean!
  #   meLike: PostLike
  # }
  extend type Comment {
    meComment: Boolean!
    meLike: CommentLike
  }
`

export const resolvers: AppResolvers = {
  Query: {
    isLoggedIn: (parent, args, { cache }): boolean => {
      return Cookies.get('userId') ? true : false
    },
  },
  // Post: {
  //   mePost: ({ id }, args, { cache }): boolean => {
  //     const data = cache.readQuery<QT.me>({ query: queries.ME })
  //     return (data?.me?.id === id) ? true : false
  //     // try {
  //     //   const data = cache.readQuery<QT.me>({ query: queries.ME })
  //     //   return (data?.me?.id === id) ? true : false
  //     // } catch (err) {
  //     //   console.log(err)
  //     // }
  //     // return false
  //   },
  //   meLike: ({ id }, args, { cache }): QT.postLike | null => {
  //     console.log("resolver: melike")
  //     try {
  //       const data = cache.readQuery<QT.myPostLikes>({
  //         query: queries.BLOCK,
  //         // query: queries.MY_POST_LIKES
  //       })
  //       return data?.myPostLikes.find((x) => x.postId === id) || null
  //     } catch (err) {
  //       // console.log(err)
  //     }
  //     return null
  //   },
  // },
  Comment: {
    meComment: ({ id }, args, { cache }): boolean => {
      try {
        const data = cache.readQuery<QT.me>({ query: queries.ME })
        return data?.me?.id === id ? true : false
      } catch (err) {
        console.log(err)
      }
      return false
    },
    meLike: ({ id }, args, { cache }): QT.commentLike | null => {
      try {
        const data = cache.readQuery<QT.myCommentLikes>({ query: queries.MY_COMMENT_LIKES })
        return data?.myCommentLikes.find(x => x.commentId === id) || null
      } catch (err) {
        console.log(err)
      }
      return null
    },
  },
  // Feed: {
  //   isClicked: (parent, args, { cache }): boolean => {
  //     const queryResult = cache.readQuery({ query: GET_CLICK })
  //     return queryResult
  //   },
  // },
  // Launch: {
  //   isInCart: (launch: LaunchTileTypes.LaunchTile, _, { cache }): boolean => {
  //     const queryResult = cache.readQuery<GetCartItemTypes.GetCartItems>({ query: GET_CART_ITEMS });
  //     if (queryResult) {
  //       return queryResult.cartItems.includes(launch.id)
  //     }
  //     return false;
  //   }
  // },
  // Mutation: {
  //   addOrRemoveFromCart: (_, { id }: { id: string }, { cache }): string[] => {
  //     const queryResult = cache.readQuery<GetCartItemTypes.GetCartItems>({ query: GET_CART_ITEMS });
  //     if (queryResult) {
  //       const { cartItems } = queryResult;
  //       const data = {
  //         cartItems: cartItems.includes(id)
  //           ? cartItems.filter((i) => i !== id)
  //           : [...cartItems, id],
  //       };
  //       cache.writeQuery({ query: GET_CART_ITEMS, data });
  //       return data.cartItems;
  //     }
  //     return [];
  //   },
  // },
}

// const a = <LoggedIn><PostLike /></LoggedIn>
