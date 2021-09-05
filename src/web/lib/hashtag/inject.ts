import { cloneDeep } from '@apollo/client/utilities'
import { Hashtag as PrismaHashtag, Poll } from '@prisma/client'
import { Hashtag as GqlHashtag } from '../../apollo/query.graphql'
import { BulletDraft, RootBulletDraft } from '../bullet/types'
import { Hashtag, HashtagGroup } from './types'

export function prismaToHashtag(prismalHashtag: PrismaHashtag & { poll: Poll | null }): Hashtag | HashtagGroup {
  if (prismalHashtag.poll) {
    return {
      ...prismalHashtag,
      type: 'hashtag-group',
      poll: prismalHashtag.poll ?? undefined,
    }
  }
  return {
    ...prismalHashtag,
    type: 'hashtag',
  }
}

export function gqlToHashtag(gqlHashtag: GqlHashtag): Hashtag | HashtagGroup {
  if (gqlHashtag.poll) {
    return {
      ...gqlHashtag,
      type: 'hashtag-group',
      id: parseInt(gqlHashtag.id),
      authorName: gqlHashtag.authorName ?? null,
      poll: {
        ...gqlHashtag.poll,
        id: parseInt(gqlHashtag.poll.id),
      },
    }
  }
  return {
    ...gqlHashtag,
    type: 'hashtag',
    id: parseInt(gqlHashtag.id),
    authorName: gqlHashtag.authorName ?? null,
  }
}

export function injectHashtags(props: {
  root: RootBulletDraft
  hashtags: (Hashtag | HashtagGroup)[]
}): RootBulletDraft {
  const { root, hashtags } = props

  function _inject<T extends BulletDraft | RootBulletDraft>(node: T): T {
    const found = hashtags.filter(e => e.bulletId === node.id)
    const _node = cloneDeep(node)
    _node.curHashtags = found.length > 0 ? found : undefined
    return {
      ..._node,
      children: _node.children.map(e => _inject(e)),
    }
  }

  return {
    ..._inject(root),
    allHashtags: hashtags.length > 0 ? hashtags : undefined,
  }
}
