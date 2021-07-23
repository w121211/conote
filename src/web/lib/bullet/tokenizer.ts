import { Token, tokenize as prismTokenize } from 'prismjs'

const LINE_VALUE_GRAMMAR = {
  ticker: { pattern: /\$[A-Z-=]+/ },
  topic: { pattern: /\[\[[^\]\n]+\]\]/u },
  stamp: { pattern: /(?<=\s)%[a-zA-Z0-9]{3}$/ },
  'vote-chocie': { pattern: /<[^>\s]+>/u },
  mark: { pattern: /[$[@\]]/ },
}

export function tokenize(text: string): (string | Token)[] {
  return prismTokenize(text, LINE_VALUE_GRAMMAR)
}

// export function tokenize(text: string, grammar: Prism.Grammar): Array<string | Prism.Token> {
//   /** 將text中的symbol($AA, [[Topic]])grammar */
//   return Prism.tokenize(text, grammar)
// }

// function tokenizeBullets(bullets: Bullet<string>[]): Bullet<TokenStream>[] {
//   return bullets.map<Bullet<TokenStream>>(e => {
//     return {
//       ...e,
//       head: tokenize(e.head, LINE_VALUE_GRAMMAR),
//       body: e.body ? tokenize(e.body, LINE_VALUE_GRAMMAR) : undefined,
//       children: e.children ? tokenizeBullets(e.children) : undefined,
//     }
//   })
// }
