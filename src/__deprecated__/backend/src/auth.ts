import { allow, rule, shield } from 'graphql-shield'
import { Context } from './context'

// function getUserId(context: Context) {
//   // const {token} = context.req.cookies
//   // if (token) {
//   //   try {
//   // 		const {userId} = verify(
//   // 			token.replace('Bearer ', ''),
//   // 			process.env.APP_SECRET
//   // 		);

//   // 		context.req.userId = userId;
//   // 	} catch (error) {
//   // 		context.res.clearCookie('token');
//   // 	}
//   // }
//   const authorization = context.req.headers.authorization
//   if (authorization) {
//     const token = authorization.replace('Bearer ', '')
//     const verifiedToken = verify(token, APP_SECRET) as Token
//     return verifiedToken && verifiedToken.userId
//   }
// }

const rules = {
  isNotAuthenticated: rule({ cache: 'contextual' })((parent, args, ctx) => {
    return !ctx.req.userId
  }),
  isAuthenticated: rule({ cache: 'contextual' })((parent, args, ctx) => {
    return Boolean(ctx.req.userId)
  }),
  // isFeedOwner: rule({ cache: 'strict' })(async (parent, { id }, ctx: Context) => {
  //   // const author = await context.prisma.post
  //   //   .findOne({ where: { id } })
  //   //   .author()
  //   const feed = await ctx.prisma.feed.findOne({
  //     where: { id },
  //     select: { userId: true },
  //   });
  //   return feed?.userId === ctx.req.userId;
  // }),
  // isLikeOwner: rule({ cache: 'strict' })(async (parent, { id }, ctx: Context) => {
  //   const res = await ctx.prisma.feed
  //     .findMany({
  //       where: { id, user: { id: ctx.req.userId } },
  //       select: { id: true }
  //     })
  //   return res.length > 0
  // }),
}

export const permissions = shield(
  {
    Query: {
      // '*': isAuthenticated
      me: rules.isAuthenticated,
      // filterPosts: rules.isAuthenticatedUser,
      // post: rules.isAuthenticatedUser,
    },
    Mutation: {
      // '*': rules.isAuthenticatedUser,
      signup: allow,
      login: allow,
      // createDraft: rules.isAuthenticatedUser,
      // deletePost: rules.isPostOwner,
      // publish: rules.isPostOwner,
      // createLike: rules.isAuthenticated,
      // createLike: rules.isAuthenticated,
      // updateLike: rules.isLikeOwner,
      // updateLike: allow,
    },
  },
  {
    allowExternalErrors: true,
  },
)
