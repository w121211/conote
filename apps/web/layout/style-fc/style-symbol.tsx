export function styleSymbol(
  symbol: string,
  title: string | undefined,
  // lightBracket?: boolean,
) {
  if (symbol.startsWith('[[')) {
    return (
      <span className="text-blue-500 dark:text-blue-400 ">
        <span className={`text-gray-400/50 dark:text-gray-400`}>[[</span>
        {symbol.substring(2, symbol.length - 2)}
        <span className={`text-gray-400/50 dark:text-gray-400`}>]]</span>
      </span>
    )
  }
  if (symbol.startsWith('@')) {
    return title && title.length > 0 ? title : symbol
  }
  return symbol
}
