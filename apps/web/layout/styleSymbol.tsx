export function styleSymbol(symbol: string, title: string, lightBracket?: boolean) {
  if (symbol.startsWith('[[')) {
    return (
      <span>
        <span className={`text-gray-300 ${lightBracket ? 'font-medium' : ''}`}>[[</span>
        {symbol.substring(2, symbol.length - 2)}
        <span className={`text-gray-300 ${lightBracket ? 'font-medium' : ''}`}>]]</span>
      </span>
    )
  }
  if (symbol.startsWith('@')) {
    return title
  }
  return symbol
}
