import React from 'react'
import { LiElement } from '../../components/editor/slate-custom-types'
import { BulletEditor } from '../../components/editor/editor'

const initialValue: LiElement[] = [
  {
    type: 'li',
    children: [{ type: 'lc', children: [{ text: '' }] }],
  },
  // {
  //   type: 'li',
  //   children: [{ type: 'lc', body: '11', error: 'warning', placeholder: 'placeholder', children: [{ text: '11' }] }],
  // },
  // {
  //   type: 'li',
  //   children: [
  //     { type: 'lc', body: '22', placeholder: 'placeholder', children: [{ text: '22' }] },
  //     {
  //       type: 'ul',
  //       children: [
  //         { type: 'li', children: [{ type: 'lc', body: '22-11', children: [{ text: '22-11' }] }] },
  //         {
  //           type: 'li',
  //           children: [
  //             { type: 'lc', children: [{ text: '' }] },
  //             {
  //               type: 'ul',
  //               children: [
  //                 { type: 'li', children: [{ type: 'lc', body: '22-11', children: [{ text: '22-11' }] }] },
  //                 { type: 'li', children: [{ type: 'lc', children: [{ text: '' }] }] },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   type: 'li',
  //   children: [
  //     {
  //       type: 'lc',
  //       body: '111',
  //       freeze: true,
  //       children: [{ text: '111 這是中文 $AAA' }],
  //     },
  //     {
  //       type: 'ul',
  //       children: [
  //         {
  //           type: 'li',
  //           children: [
  //             {
  //               type: 'lc',
  //               body: '333',
  //               // freeze: true,
  //               id: 123,
  //               warning: 'warning',
  //               children: [{ text: '333' }],
  //             },
  //             {
  //               type: 'ul',
  //               children: [
  //                 {
  //                   type: 'li',
  //                   children: [
  //                     {
  //                       type: 'lc',
  //                       body: '444',
  //                       root: true,
  //                       children: [{ text: '444' }],
  //                     },
  //                   ],
  //                 },
  //                 {
  //                   type: 'li',
  //                   children: [
  //                     {
  //                       type: 'lc',
  //                       body: '555',
  //                       children: [{ text: '555' }],
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         {
  //           type: 'li',
  //           children: [
  //             {
  //               type: 'lc',
  //               body: '666',
  //               children: [{ text: '666' }],
  //             },
  //             {
  //               type: 'ul',
  //               children: [
  //                 {
  //                   type: 'li',
  //                   children: [
  //                     {
  //                       type: 'lc',
  //                       body: '777',
  //                       children: [{ text: '777' }],
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   type: 'li',
  //   children: [
  //     {
  //       type: 'lc',
  //       root: true,
  //       // placeholder: 'Type some symbol and press enter',
  //       children: [{ text: '$BA' }],
  //       asOauthor: true,
  //     },
  //   ],
  // },
  // {
  //   type: 'li',
  //   children: [
  //     {
  //       type: 'lc',
  //       root: true,
  //       placeholder: 'Type some symbol and press enter',
  //       warning: 'Here is a warning',
  //       children: [{ text: '' }],
  //     },
  //   ],
  // },
]

const TestPage = (): JSX.Element => {
  return <div>{/* <BulletEditor initialValue={initialValue} /> */}</div>
}

export default TestPage
