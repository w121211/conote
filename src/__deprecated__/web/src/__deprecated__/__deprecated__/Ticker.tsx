// import React from 'react'
// import { RouteComponentProps } from "@reach/router"
// import { Radio, Card, Typography, Tag, Divider, Button, Input, Form } from 'antd'

// import { Chart } from '../components/__deprecated/_lightweightChart'

// export function Ticker(props: RouteComponentProps) {
//   return (
//     <>
//       <Typography.Title>Commodo viverra maecenas, $ASO</Typography.Title>
//       <p />
//       <Button type="primary">Track</Button>

//       <Chart />

//       <h3>Price Estimate</h3>

//       <Form name="predict">
//         <Form.Item label="Action">
//           <Radio.Group onChange={(e) => { console.log(e.target.value) }}>
//             <Radio value={1}>Buy</Radio>
//             <Radio value={2}>Hold</Radio>
//             <Radio value={3}>Sell</Radio>
//           </Radio.Group>
//         </Form.Item>
//         <Form.Item label="Target price | Buy Price">
//           <Input placeholder="123.45" />
//         </Form.Item>
//         <Form.Item label="Stop-loss price | Sell Price">
//           <Input placeholder="70.00" />
//         </Form.Item>
//       </Form>

//       <h4>Group Estimate [Accuracy: 61%]</h4>
//       <p>Buy: 123.45</p>
//       <p>Sell: 146.78</p>

//       <h4>@Tsubane Estimate [Accuracy: 63%]</h4>
//       <p>Buy: 123.45</p>
//       <p>Sell: 146.78</p>

//       <Divider />

//       <a>
//         <b>Short </b> (___%)
//       </a>
//       ||
//       <a>
//         <b> Long</b> (___%)
//       </a>

//       <Card size="small">
//         <a>
//           <Typography.Text strong>Ant Design, a design language for background applications, is refined by Ant UED Team</Typography.Text>
//         </a>
//         <Tag>event-aaa-bbb</Tag>
//         <Tag>$ABC</Tag>
//         <Tag>$OPQ</Tag>
//         <br />
//         <Typography.Text type="secondary">17:32 Source.com | 12 Comments</Typography.Text>
//       </Card>
//       <p />
//       <Card size="small">
//         <Typography.Text strong>[Post] Ant Design, a design language for background applications, is refined by Ant UED Team</Typography.Text>
//         <Tag>event-aaa-bbb</Tag>
//         <Tag>$ABC</Tag>
//         <Tag>$OPQ</Tag>
//         <p>Fringilla phasellus faucibus scelerisque eleifend donec pretium ...</p>
//         <Typography.Text type="secondary">17:32 Source.com</Typography.Text>
//       </Card>
//       <p />
//       <Card size="small">
//         <a>
//           <Typography.Text strong>[Post] Ant Design, a design language for background applications, is refined by Ant UED Team</Typography.Text>
//         </a>
//         <Tag>event-aaa-bbb</Tag>
//         <Tag>$ABC</Tag>
//         <Tag>$OPQ</Tag>
//         <p>Fringilla phasellus faucibus scelerisque eleifend donec pretium. Eget est lorem ipsum dolor sit amet consectetur adipiscing elit. Lectus nulla at volutpat diam ut venenatis. Vitae tempus quam pellentesque nec nam aliquam sem et. Tristique magna sit amet purus gravida quis blandit turpis cursus. Proin fermentum leo vel orci porta non pulvinar neque laoreet. Et netus et malesuada fames ac turpis egestas integer eget. Sagittis vitae et leo duis ut diam quam. Natoque penatibus et magnis dis parturient. Pretium vulputate sapien nec sagittis aliquam malesuada. Nec feugiat in fermentum posuere urna nec tincidunt praesent semper. Feugiat nisl pretium fusce id velit ut tortor pretium viverra. Aliquet enim tortor at auctor urna nunc id cursus metus. Malesuada bibendum arcu vitae elementum curabitur vitae nunc sed.</p>
//         <Typography.Text type="secondary">17:32 Source.com</Typography.Text>
//         <Divider />
//         <Typography.Text underline>Comments [打開後才顯示]</Typography.Text>
//         <ul>
//           <li>Dictum non consectetur a erat nam at lectus urna.<br /><a>upvote</a></li>
//           <li>Dolor purus non enim praesent elementum facilisis leo.<br /><a>upvote</a></li>
//           <li>Vel pretium lectus quam id leo in vitae turpis <a>edit</a><br />30 ups</li>
//         </ul>
//         <a>23 more</a>
//         <Input
//           placeholder="Your comment"
//           style={{ width: 200 }}
//         />
//         <Button>SUBMIT</Button>
//       </Card>
//       <p />
//       <Button>loading more</Button>
//     </>
//   )
// }