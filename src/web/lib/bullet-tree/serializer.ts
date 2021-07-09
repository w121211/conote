import { Descendant, Element, Node } from 'slate'
import { BulletBodyElement, BulletHeadElement } from './slate-custom-types'
import { Bullet, BulletInput } from './types'

/**
 * Traver a slate element node and convert to bullet node and return
 */
export function serialize(value: Descendant[]): BulletInput[] {
  function _serializeNode(node: Descendant): BulletInput | null {
    if (Element.isElement(node) && node.type === 'bullet') {
      let head: string
      let body: string | undefined

      if (node.children[0].type === 'bullet-head') {
        head = Node.string(node.children[0])
      } else {
        throw new Error('bullet一定要有第一個child，且一定是bullet-head')
      }
      if (node.children[1]?.type === 'bullet-body') {
        body = Node.string(node.children[1])
      }
      return {
        id: node.id,
        head,
        body,
        children:
          node.children.length > 0
            ? node.children.map(e => _serializeNode(e)).filter((e): e is BulletInput => e !== null)
            : undefined,
      }
    }
    return null
  }

  return value.map(e => _serializeNode(e)).filter((e): e is BulletInput => e !== null)
}

/**
 * Traver a bullet node and convert to slate element node and return
 */
export function deserialize(node: BulletInput): Element {
  // bullet一定要有head
  const head: BulletHeadElement = {
    type: 'bullet-head',
    children: [{ text: node.head }],
  }
  const children: Element[] = [head]

  // bullet不一定有body
  if (node.body) {
    const body: BulletBodyElement = {
      type: 'bullet-body',
      children: [{ text: node.body }],
    }
    children.push(body)
  }

  return {
    type: 'bullet',
    id: node.id,
    children: children.concat(node.children?.map(e => deserialize(e)) ?? []),
  }
}

// function serialize(nodes: Node[]): Bullet<string>[] {
//   const bullets: Bullet<string>[] = []
//   for (const node of nodes) {
//     if (Element.isElement(node) && node.type === 'bullet') {
//       let head: string, body: string | undefined
//       if (node.children[0].type === 'bullet-head') {
//         head = Node.string(node.children[0])
//       } else {
//         throw new Error('bullet的第一個children一定為bullet-head')
//       }
//       if (node.children[1]?.type === 'bullet-body') {
//         body = Node.string(node.children[1])
//       }
//       bullets.push({
//         head,
//         body,
//         children: node.children.length > 0 ? serialize(node.children) : undefined,
//       })
//     }
//   }
//   return bullets
// }

// function deserialize(bullets: Bullet<string>[]): Element[] {
//   return bullets.map<Element>(e => {
//     const children: Element[] = []
//     children.push({ type: 'bullet-head', children: [{ text: e.head }] })
//     if (e.body) {
//       children.push({ type: 'bullet-body', children: [{ text: e.body }] })
//     }
//     return {
//       type: 'bullet',
//       children: [...children, ...deserialize(e.children ?? [])],
//     }
//   })
// }
