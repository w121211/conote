import {
  reAuthor,
  reTicker,
  reTopic,
} from '../../components/block-editor/src/parse-render'

export function styleSymbol(
  text: string,
  title: string | undefined,
  // lightBracket?: boolean,
) {
  if (reTopic.test(text)) {
    return (
      <span className="text-blue-500 dark:text-blue-400 ">
        <span className={`text-gray-400/50 dark:text-gray-400`}>[[</span>
        {text.substring(2, text.length - 2)}
        <span className={`text-gray-400/50 dark:text-gray-400`}>]]</span>
      </span>
    )
  }
  if (text.startsWith('@')) {
    return title && title.length > 0 ? title : text
  }
  return text
}
