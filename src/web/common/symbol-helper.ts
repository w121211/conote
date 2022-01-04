export const SymbolHelper = {
  removeTopicPrefixSuffix(topicSymbol: string): string {
    return topicSymbol.substring(2, topicSymbol.length - 2)
  },
}
