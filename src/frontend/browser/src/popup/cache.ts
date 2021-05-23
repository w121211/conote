import { InMemoryCache, Reference } from '@apollo/client'
// import * as QT from '../graphql/query-types'

// const cache = new InMemoryCache({
//   dataIdFromObject: (o: any) => {
//     switch (o.__typename) {
//       case 'Like': {
//         if (o.feedId) return `Like:Feed:${o.feedId}`
//         else if (o.commentId) return `Like:Comment:${o.commentId}`
//         else if (o.postId) return `Like:Post:${o.postId}`
//         else if (o.pollId) return `Like:Poll:${o.pollId}`
//         else return null
//       }
//       default:
//         return defaultDataIdFromObject(o)
//     }
//   },
// })

// cache.writeData({
//   data: {
//     // me: null,
//     // isLoggedIn: !!localStorage.getItem('token'),
//     // isLoggedIn: false,
//     cartItems: [],
//     isClicked: false,
//     // myPostLikes: [],
//     myLikes: [
//       {
//         __typename: 'Like',
//         id: 'id-id-id',
//         feedId: '1234',
//         postId: null,
//         pollId: null,
//         commentId: null,
//         choice: 1,
//         updatedAt: '12-12-2012',
//       },
//       {
//         __typename: 'Like',
//         id: 'id-id-id2',
//         feedId: null,
//         postId: null,
//         pollId: null,
//         commentId: '1234',
//         choice: 1,
//         updatedAt: '12-12-2012',
//       },
//     ],
//   },
// })

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
// browser.storage

=======
>>>>>>> 514adbb... .
=======
// browser.storage

>>>>>>> 6e31220... add extension
=======
// browser.storage

>>>>>>> backend-dev
export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn() {
          return isLoggedInVar()
        },
        latestCards: {
          keyArgs: false,
          merge(existing: Reference[] = [], incoming: Reference[]) {
            const filtered = existing.filter(e => {
              return incoming.find(f => e.__ref === f.__ref) === undefined
            })
            return [...filtered, ...incoming]
            // return [...existing, ...incoming]
          },
        },
      },
    },
  },
})

export const isLoggedInVar = cache.makeVar<boolean>(!!localStorage.getItem('token'))
