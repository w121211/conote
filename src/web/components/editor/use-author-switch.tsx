export const useAuthorSwitcher = (props: { authorName?: string }): [string, JSX.Element] => {
  const { authorName } = props
  const [author, setAuthor] = useState<string>(authorName ?? '@self')
  const switcher = authorName ? (
    <button
      onClick={() => {
        if (author === '@self') {
          setAuthor(authorName)
        } else {
          setAuthor('@self')
        }
      }}
    >
      {author}
    </button>
  ) : (
    <span>{author}</span>
  )
  return [author, switcher]
}
