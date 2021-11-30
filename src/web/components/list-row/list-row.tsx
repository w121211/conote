import React from 'react'
import Link from 'next/link'
import classes from './list-row.module.scss'

const ListRow = ({
  href,
  title,
  sourceUrl,
  summary,
  hashtags,
  author,
  shot,
}: {
  href: string
  title: string
  sourceUrl?: string
  author?: string
  summary?: string
  hashtags?: string
  shot?: string
}): JSX.Element => {
  return (
    <div className={classes.container}>
      <Link href={href}>
        {/* <a>{e.link.url.substring(0, 50).replace('//', '').replace('[[', '').replace(']]', '')}</a> */}
        <a className={classes.link}>
          {/* <div> */}
          <div className={classes.left}>
            {shot && (
              <span
                className={`${classes.shot} ${
                  shot.match('buy') ? classes.shotGreen : shot.match('sell') ? classes.shotRed : ''
                }`}
              >
                {shot}
              </span>
            )}

            {/* {sourceUrl && (
                <div className={classes.url}>
                <span className={classes.topDivider}></span> {sourceUrl}
                </div>
              )} */}
            {/* <div className={classes.lcElementHashtag}>$MU $TXN #up(10) </div> */}
            <h3 className={classes.title}>
              {title}
              {summary && <div className={classes.summary}>{summary}</div>}
            </h3>

            {author ? <div className={classes.author}>{author}</div> : ''}
          </div>
          {/* </div> */}
          <div className={classes.emojisContainer}>
            <span>👍22</span>
            <span>👎10</span>
          </div>
        </a>
      </Link>
    </div>
  )
}

export default ListRow
