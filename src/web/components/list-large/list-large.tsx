import React from 'react'
import Link from 'next/link'
import classes from './list-large.module.scss'
import { useCardEmojisQuery } from '../../apollo/query.graphql'
import CardEmojis from '../emoji-up-down/card-emojis-display'

const ListLarge = ({
  href,
  title,
  sourceUrl,
  source,
  summary,
  hashtags,
  author,
  shot,
  currentHashtag,
  cardId,
}: {
  cardId: string
  href: string
  title: string
  sourceUrl?: string
  source?: string
  author?: string
  summary?: string[]
  hashtags?: string[]
  shot?: string
  currentHashtag?: string
}): JSX.Element => {
  return (
    <div className={classes.container}>
      <div>
        <div className={classes.top}>
          {hashtags && (
            <div className={classes.hashtagContainer}>
              {hashtags.map((e, i) => {
                return (
                  <div
                    className={`${classes.hashtag} ${e === '#watch' ? classes.watch : ''} ${
                      currentHashtag === e ? classes.selectedHashtag : ''
                    }`}
                    key={i}
                  >
                    {e}
                  </div>
                )
              })}
            </div>
          )}
          {hashtags && source && <span className={classes.topDivider}></span>}
          {author && (
            <Link href={`/author/${author}`}>
              <a>
                <div className={classes.author}>{author}</div>
              </a>
            </Link>
          )}
          {/* {shot && <span className={classes.shot}>{shot}</span>} */}
          {/* {source && <div className={classes.source}>{source}</div>} */}

          {(author || hashtags || source) && <span className={classes.topDivider}></span>}
          {sourceUrl && <div className={classes.url}>{sourceUrl}</div>}
          {/* <div className={classes.lcElementHashtag}>$MU $TXN #up(10) </div> */}
        </div>
        <Link href={href}>
          <a className={classes.link}>
            <h3 className={classes.title}>{title}</h3>
          </a>
        </Link>
        {summary && (
          <div className={classes.summary}>
            {summary.map((e, i) => {
              return (
                <span key={i}>
                  {i > 0 && ' · '}
                  {e}
                </span>
              )
            })}
          </div>
        )}

        <CardEmojis cardId={cardId} />
      </div>
    </div>
  )
}

export default ListLarge
