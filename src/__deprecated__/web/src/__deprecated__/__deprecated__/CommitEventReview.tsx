import React from 'react'
import { RouteComponentProps } from "@reach/router"
import { Radio, Divider, Form, Input, Button, Checkbox, Layout, Typography, Tag } from 'antd'

export function CommitEventReview(props: RouteComponentProps) {
  return (
    <>
      <Typography>
        <Typography.Title>Review Event Commit</Typography.Title>
        <Typography.Paragraph>
          <Typography.Text strong>Derived from the parent event: </Typography.Text>No
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Typography.Text strong>Parent event: </Typography.Text>parent-event-short
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Typography.Text strong>Title: </Typography.Text>Cras adipiscing enim eu turpis egestas pretium aenean
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Typography.Text strong>Short name: </Typography.Text>this-is-a-event-name
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Typography.Text strong>Tags: </Typography.Text>#aaa, #bbb, #ccc<Typography.Text type="danger">, #ddd</Typography.Text>
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Typography.Text strong>Committer: </Typography.Text>@anonymous
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Typography.Text strong>Committed at: </Typography.Text>7-1-2020
        </Typography.Paragraph>
      </Typography>

      <Divider />

      Current Status:
      <ul>
        <li>Review Open: 7-1-2020</li>
        <li>Review Close: 8-1-2020 (1 day left)</li>
        <li>Invited reviewers: 10</li>
        <li>Criterias to pass: 1. 3 or more agrees 2. agrees is greater than disagrees</li>
        <li>Agree: ***</li>
        <li>Disagree: ***</li>
        <li>Undecided: ***</li>
      </ul>

      <p>Your decision (can be modified during review open period)</p>
      <Radio.Group onChange={e => { console.log(e.target.value) }} defaultValue="a">
        <Radio.Button value="a">AGREE</Radio.Button>
        <Radio.Button value="b">DISAGREE</Radio.Button>
        <Radio.Button value="c">UNDECIDED</Radio.Button>
      </Radio.Group>

      <Divider />
      <Typography.Paragraph>
        <Typography.Text underline>Discussion</Typography.Text>
        <ul>
          <li>
            [#1 @Reviewer] Dictum non consectetur a erat nam at lectus urna.<br />
            <a>upvote</a>
          </li>
          <li>
            [#2 @Committer] Dolor purus non enim praesent elementum facilisis leo.<br />
            <a>upvote</a>
          </li>
          <li>
            (deleted by the author)
          </li>
          <li>
            [#4 @Reviewer] Vel pretium lectus quam id leo in vitae turpis <a>edit</a> <a>delete</a><br />
            30 ups
          </li>
        </ul>
        {/* <a>23 more</a> */}
        <Input
          placeholder="Your comment"
          style={{ width: 200 }}
        />
        <Button>SUBMIT</Button>
      </Typography.Paragraph>
    </>
  )
}