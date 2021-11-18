import React from 'react'
import Link from 'next/link'
import classes from './list-large.module.scss'

const ListLarge = ({
  href,
  title,
  sourceUrl,
  source,
  summary,
  hashtags,
  author,
  shot,
}: {
  href: string
  title: string
  sourceUrl?: string
  source?: string
  author?: string
  summary?: string
  hashtags?: string[]
  shot?: string
}): JSX.Element => {
  return (
    <div className={classes.container}>
      <Link href={href}>
        {/* <a>{e.link.url.substring(0, 50).replace('//', '').replace('[[', '').replace(']]', '')}</a> */}
        <a className={classes.link}>
          <div>
            <div className={classes.top}>
              {hashtags && (
                <div className={classes.hashtagContainer}>
                  {hashtags.map((e, i) => {
                    return (
                      <div className={`${classes.hashtag} ${e === '#watch' ? classes.watch : ''}`} key={i}>
                        {e}
                      </div>
                    )
                  })}
                </div>
              )}
              {hashtags && source && <span className={classes.topDivider}></span>}
              {author ? <div className={classes.author}>{author}</div> : <div className={classes.author}></div>}
              {/* {shot && <span className={classes.shot}>{shot}</span>} */}
              {source && <div className={classes.source}>{source}</div>}

              {sourceUrl && (
                <div className={classes.url}>
                  {author || hashtags || (source && <span className={classes.topDivider}></span>)}
                  {sourceUrl}
                </div>
              )}
              {/* <div className={classes.lcElementHashtag}>$MU $TXN #up(10) </div> */}
            </div>
            <h3 className={classes.title}>{title}</h3>
            {summary && <div className={classes.summary}>{summary}</div>}

            <div className={classes.emojisContainer}>
              <span>👍22</span>
              <span>👎10</span>
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}

export default ListLarge
