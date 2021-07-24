import { useRef, useEffect, useState } from 'react'
import { head, body, nestedCards, card, Bullet } from '../components/dummy'
import Board from '../components/board/board-page'
import classes from '../../components/card.module.scss'
import classesCardPage from '../card/card-page.module.scss'
import CommentList from '../components/commentList/commentList'

const BulletBody = ({ childrenArr }: { childrenArr: Bullet[] }) => {
  const [showChildren, setShowChildren] = useState(false)
  return (
    <>
      {childrenArr.map((e, i) => {
        //   !e.pin && (
        return (
          <span className={classes.inlineValue} key={i}>
            <span className={classes.bulletWrapper}>
              <span
                className={classes.bullet}
                onClick={() => {
                  setShowChildren(prev => !prev)
                }}
              >
                •
              </span>
            </span>
            <span>
              {e.head}
              <span className={classes.tags}> @娜娜</span>
              <span className={classes.tags}> #哈哈測試test</span>
              {showChildren && Array.isArray(e.children) && <BulletBody childrenArr={e.children} />}
            </span>
          </span>
        )
        //   )
      })}
    </>
  )
}
const BulletHead = ({ childrenArr }: { childrenArr: Bullet[] }) => {
  return (
    <>
      {childrenArr.map((e, i) => (
        <>
          {/* 去除有pin 的  */}

          {e.children && e.children.length !== 0 && (
            <div key={i}>
              {e.head}

              <BulletBody childrenArr={e.children} />
            </div>
          )}
        </>
      ))}
    </>
  )
}

const CardHead = ({ scrollTop }: { scrollTop: number }) => {
  const headerRef = useRef<HTMLDivElement>(null)
  const hasWindow = typeof window !== undefined
  //   const [windowWidth, setWindowWidth] = useState(hasWindow ? window.innerWidth : null)

  //暫時
  const [windowWidth, setWindowWidth] = useState(0)
  useEffect(() => {
    if (typeof window !== undefined) {
      setWindowWidth(window.innerWidth)
    }
  })

  //暫時//
  useEffect(() => {
    if (hasWindow) {
      window.addEventListener('resize', () => {
        setWindowWidth(window.innerWidth)
      })
      return () =>
        window.removeEventListener('resize', () => {
          setWindowWidth(window.innerWidth)
        })
    }
  }, [hasWindow])
  return (
    <div
      className={classes.header}
      ref={headerRef}
      style={{
        top: `-${
          headerRef.current &&
          windowWidth &&
          (windowWidth < 500 ? headerRef.current.clientHeight - 80 : headerRef.current.clientHeight - 45)
        }px`,
      }}
    >
      <div>
        {card.type === 'WEBPAGE' && (
          //   <h1 className={classes.tickerTitle}>{cardTitle.replace('[[', '').replace(']]', '')}</h1>
          // ) : (
          <>
            <div className={classes.headerTopWrapper}>
              <span className={classes.flexContainer}>
                <span className={classes.author}>
                  測試測試yaya
                  {/* <a href={cardTitle} target="_blank" rel="noreferrer"> */}
                  {/* {card.link.oauthorName?.replace(/(.+):.+/gm, '$1')} */}
                  {/* <LinkIcon className={classes.linkIcon} /> */}
                  {/* </a> */}
                </span>
                {/* <span className={classes.webName}></span> */}
                <span className={classes.date}>2021 / 4 / 9</span>
              </span>
              {/* <ClockIcon className={classes.clockIcon} /> */}
              {/* <span className={classes.date}>{publishDate && stringToArr(publishDate.text ?? "", "T", 0)}</span> */}
              {/* <MyTooltip
            title="ARK女股神Cathie Wood持续加仓买入已经拥有1400万美元 不能错过的新能源股票 电动三宝
            蔚来，理想，小鹏，特斯拉股票交易策略更新 NIU股票小牛电动股票分析 美股投资"
          > */}
              <a
                className={classes.link}
                href={card.symbol.replace(/^\[\[(.+)\]\]/gm, '$1')}
                target="_blank"
                rel="noreferrer"
              >
                {/* <span
                  className={`${classes.title} ${titleClick ? classes.titleExpand : ''} ${
                    scrollTop > 90 && classes.scroll
                  } `}
                //   onClick={titleClickedHandler}
                //   ref={titleRef}
                > */}
                <span
                  className={`${classes.title} ${scrollTop > 90 && classes.scroll} `}
                  //   onClick={titleClickedHandler}
                  //   ref={titleRef}
                >
                  {card.head.value.title}
                </span>
                {/* <LinkIcon className={classes.linkIcon} /> */}
                {/* 連結{'\n'} */}
              </a>
            </div>
            <div className={`${classes.symbolContainer} ${scrollTop > 90 && classes.scroll && classes.scroll}`}>
              {/* <span>Tags:</span> */}
              {card.body.nestedCards &&
                card.body.nestedCards.map((e, i) => {
                  return (
                    <span key={i} className={classes.symbol}>
                      {e.cardSymbol.replace(/^\[\[(.+)\]\]/gm, '$1')}
                    </span>
                  )
                })}
            </div>
            <span
              className={`${classes.title} ${classes.titleShort} ${scrollTop > 91 && classes.scroll}`}
              // onClick={titleClickedHandler}
              // ref={titleRef}
            >
              {card.head.value.title}
            </span>
            {/* </MyTooltip> */}
          </>
        )}
      </div>
      <div>{card.body.root.children && <BulletHead childrenArr={card.body.root.children} />}</div>
    </div>
  )
}

const CardBody = () => {
  interface Board {
    boardId: string
    visible: boolean
  }
  const [board, setBoard] = useState<Board>({ boardId: '', visible: false })
  const hideBoardHandler = () => {
    setBoard({ boardId: '', visible: false })
  }
  return (
    <div className={classesCardPage.cardElement}>
      {nestedCards.map((e, i) => {
        return (
          <div className={classes.cardSection} key={i}>
            <div className={classes.tickerTitle}>
              {e.head.value.title}

              <span className={classes.symbolFullName}>{e.head.value.template}</span>

              {e.body.root.children && (
                <div className={classes.headerAuthorLines}>
                  {e.body.root.children.map((e, i) => (
                    <>
                      {e.children?.map((e, i) => (
                        <span className={classes.authorTagWrapper} key={i}>
                          {e.pin && e.pollChoices && (
                            <span
                              className={classes.authorTag}
                              key={i}
                              onClick={() => setBoard({ boardId: '148', visible: true })}
                            >
                              {/* {e.pollChoices} */}
                              買/賣/觀望
                            </span>
                          )}
                        </span>
                      ))}
                    </>
                  ))}
                </div>
              )}
            </div>
            {e.body.root.children && (
              <div className={classes.marker}>
                {e.body.root.children.map((e, i) => (
                  <>
                    {e.head === '[?]' && e.children?.find(e => e.pin) ? null : (
                      <>
                        <div>{e.head}</div>
                        {e.children && e.children.length !== 0 && <BulletBody childrenArr={e.children} />}
                      </>
                    )}
                  </>
                ))}
              </div>
            )}
          </div>
        )
      })}
      <Board boardId="148" visible={board.visible} hideBoard={hideBoardHandler} />
    </div>
  )
}

const CardPage = () => {
  const [scrollTop, setScrollTop] = useState(0)

  return (
    <div
      className={classesCardPage.mainInner}
      onScroll={e => {
        e.target as HTMLElement
        setScrollTop((e.target as HTMLElement).scrollTop)
      }}
    >
      <CardBody />

      <CardHead scrollTop={scrollTop} />
      <CommentList boardId="100" />
    </div>
  )
}
export default CardPage
