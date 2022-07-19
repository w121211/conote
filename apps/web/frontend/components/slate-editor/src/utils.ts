import { Editor, Element, Node } from 'slate'
import type { ElementLc, ElementLi, ElementUl } from './interfaces'

export function isUl(node: Node): node is ElementUl {
  return !Editor.isEditor(node) && Element.isElement(node) && node.type === 'ul'
}

export function isLi(node: Node): node is ElementLi {
  return !Editor.isEditor(node) && Element.isElement(node) && node.type === 'li'
}

export function isLiArray(nodes: Node[]): nodes is ElementLi[] {
  for (const e of nodes) {
    if (!isLi(e)) {
      return false
    }
  }
  return true
}

export function isLc(node: Node): node is ElementLc {
  return !Editor.isEditor(node) && Element.isElement(node) && node.type === 'lc'
}
