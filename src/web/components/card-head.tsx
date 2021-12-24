/**
 * Card Head
 * - UI @see https://www.notion.so/Try-UI-cc332868e91d48e6a99cf7978a420fc3
 */

const CardMetaForm = (): JSX.Element => {
  return <></>
}

const CardEmojis = (): JSX.Element => {}

const CardHead = ({ doc, card, symbol }: { doc: Doc; card: CardFragment | null; symbol: string }): JSX.Element => {
  return (
    <>
      <CardMetaForm />
      <CardEmojis />
    </>
  )
}

const CardHead = ({ doc }: { doc: Doc; card: CardFragment | null; symbol: string }): JSX.Element => {
  // const mainDoc = useObservable(() => workspace.mainDoc$)
  const status = useObservable(() => workspace.status$)
  const [showHeaderHiddenBtns, setShowHeaderHiddenBtns] = useState(false)
  const [cardMetaSubmitted, setCardMetaSubmitted] = useState(false)
  const hiddenBtnRef = useRef<HTMLDivElement>(null)

  const handleCardMetaSubmitted = () => {
    setCardMetaSubmitted(true)
  }

  return (
    <div className="flex flex-col mb-6">
      <div
        onMouseOver={e => {
          if (!hiddenBtnRef.current?.contains(e.target as Node)) {
            setShowHeaderHiddenBtns(false)
          } else {
            setShowHeaderHiddenBtns(true)
          }
        }}
        onMouseOut={e => {
          setShowHeaderHiddenBtns(false)
        }}
        ref={hiddenBtnRef}
      >
        <div className="flex items-center gap-4 mb-2">
          {card && (
            <CardMetaForm
              cardId={card?.id}
              showBtn={showHeaderHiddenBtns}
              handleCardMetaSubmitted={handleCardMetaSubmitted}
            />
          )}

          {doc?.symbol.startsWith('@http') && (
            <a
              className="inline-flex items-center overflow-hidden text-gray-500 hover:text-gray-700"
              href={doc?.symbol.substr(1)}
              style={showHeaderHiddenBtns ? { opacity: 1 } : { opacity: 0 }}
              target="_blank"
              rel="noreferrer"
            >
              <span className="material-icons text-lg">open_in_new</span>
              <span className="flex-shrink min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
                {card?.meta.url}
              </span>
            </a>
          )}
        </div>
        {card?.meta?.author && (
          <Link href={`/author/${encodeURIComponent('@' + card?.meta?.author)}`}>
            <a className="text-sm text-blue-500 hover:underline hover:underline-offset-1">@{card?.meta?.author}</a>
          </Link>
        )}
        <h1 className="mb-4 line-clamp-2 break-all">{card?.meta.title || symbol}</h1>
      </div>
      {/* {cardMetaData?.cardMeta.keywords && (
          <div className={classes.headerKw}>
            {cardMetaData?.cardMeta.keywords.map((e, i) => {
              if (i < 5) {
                return (
                  <span className={classes.headerKwEl} key={i}>
                    {e}
                  </span>
                )
              }
              return null
            })}
            {cardMetaData.cardMeta.keywords.length > 5 && (
              <span
                className={classes.headerKwElHidden}
                onClick={e => {
                  e.stopPropagation()
                  setShowKwTooltip(true)
                }}
              >
                ...+{cardMetaData.cardMeta.keywords.length - 5}項
                <MyTooltip
                  className={classes.headerKwElTooltip}
                  visible={showKwTooltip}
                  handleVisibleState={() => {
                    setShowKwTooltip(false)
                  }}
                >
                  {cardMetaData?.cardMeta.keywords.map((e, i) => {
                    if (i >= 5) {
                      return (
                        <span className={classes.headerKwEl} key={i}>
                          {e}
                        </span>
                      )
                    }
                    return null
                  })}
                </MyTooltip>
              </span>
            )}
          </div>
        )} */}
      <div className="flex items-center w-full">{card && <HeaderCardEmojis cardId={card?.id} />}</div>
    </div>
  )
}
