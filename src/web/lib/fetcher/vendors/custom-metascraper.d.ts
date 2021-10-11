declare module 'metascraper' {
  interface Metadata {
    author: string
    date: string
    description: string
    image: string
    publisher: string
    title: string
    url: string
    // [key: string]: string
    lang: string
    keywords: string
  }
}

declare module '@metascraper/helpers' {
  export function toRule(mapper, opts): ({ htmlDom, url }) => Promise<string>
}
