import { fromMarkdown } from 'mdast-util-from-markdown'

export function parse(str: string) {
  return fromMarkdown(str)
  //   console.log(tree)
}
