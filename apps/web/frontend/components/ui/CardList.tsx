/**
 * Reference https://flowbite.com/docs/components/card/#card-with-list
 */
function CardList<T extends { id: string }>({
  header,
  items,
  renderItem,
}: {
  header?: JSX.Element
  items: T[]
  renderItem: (item: T) => JSX.Element
}) {
  return (
    <div className="-full max-w-2xl dark:bg-gray-800 dark:bowrder-gray-700">
      <div className="flex justify-between items-center mb-4">{header}</div>
      <div>
        {items.length > 0 ? (
          <ul
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            {items.map(e => (
              <li key={e.id} className="py-2 sm:py-3">
                <div className="flex items-center space-x-4">
                  {renderItem(e)}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">Empty :{'('}</p>
        )}
      </div>
    </div>
  )
}

export default CardList
