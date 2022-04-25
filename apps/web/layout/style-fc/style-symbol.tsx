export function styleSymbol(
  symbol: string,
  title: string | undefined,
  // lightBracket?: boolean,
) {
  if (symbol.startsWith('[[')) {
    return (
      <span>
        <span className={`text-gray-400/50 `}>[[</span>
        {symbol.substring(2, symbol.length - 2)}
        <span className={`text-gray-400/50 `}>]]</span>
      </span>
    )
  }
  if (symbol.startsWith('@')) {
    return title && title.length > 0 ? title : symbol
  }
  return symbol
}
