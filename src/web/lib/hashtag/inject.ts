import { cloneDeep } from '@apollo/client/utilities'
import { Hashtag as DBHashtag, HashtagCount } from '@prisma/client'
import { Hashtag as GQLHashtag } from '../../apollo/query.graphql'
import { BulletDraft, RootBulletDraft } from '../bullet/types'

// export function prismaToHashtag(prismalHashtag: PrismaHashtag & { poll: Poll | null }): Hashtag | HashtagGroup {
//   if (prismalHashtag.poll) {
//     return {
//       ...prismalHashtag,
//       type: 'hashtag-group',
//       poll: prismalHashtag.poll ?? undefined,
//     }
//   }
//   return {
//     ...prismalHashtag,
//     type: 'hashtag',
//   }
// }

// export function gqlToHashtag(gqlHashtag: GqlHashtag): Hashtag | HashtagGroup {
//   if (gqlHashtag.poll) {
//     return {
//       ...gqlHashtag,
//       type: 'hashtag-group',
//       id: parseInt(gqlHashtag.id),
//       authorName: gqlHashtag.authorName ?? null,
//       poll: {
//         ...gqlHashtag.poll,
//         id: parseInt(gqlHashtag.poll.id),
//       },
//     }
//   }
//   return {
//     ...gqlHashtag,
//     type: 'hashtag',
//     id: parseInt(gqlHashtag.id),
//     authorName: gqlHashtag.authorName ?? null,
//   }
// }

export function toGQLHashtag(hashtag: DBHashtag & { count: HashtagCount }): GQLHashtag {
  return {
    ...hashtag,
    id: hashtag.id.toString(),
    count: {
      ...hashtag.count,
      id: hashtag.count.id.toString(),
    },
  }
}

export function injectHashtags(props: { root: RootBulletDraft; hashtags: GQLHashtag[] }): RootBulletDraft {
  const { root, hashtags } = props

  if (hashtags.length === 0) {
    return root
  }

  function _inject<T extends BulletDraft | RootBulletDraft>(node: T): T {
    const found = hashtags.filter((e): e is GQLHashtag => e.bulletId === node.id)
    const _node = cloneDeep(node)
    return {
      ..._node,
      emojis: found.length > 0 ? found : undefined,
      children: _node.children.map(e => _inject(e)),
    }
  }

  return {
    ..._inject(root),
    // allHashtags: hashtags.length > 0 ? hashtags : undefined,
  }
}
