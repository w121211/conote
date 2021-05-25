declare module 'remark-wiki-link' {
  export function wikiLinkPlugin(opts: {}): void
}

declare module '*.scss'

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}
