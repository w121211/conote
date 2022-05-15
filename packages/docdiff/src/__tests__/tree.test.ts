// import { inspect } from 'util'
// import { cloneDeep, isEqual } from 'lodash'
// import { TreeService, TreeChangeService, TreeNode, MonoNode } from '..'

// type Bullet = {
//   id?: string
//   cid: string
//   head: string
// }

// const bt = (cid: number, children: TreeNode<Bullet>[] = []): TreeNode<Bullet> => {
//   return {
//     cid: cid.toString(),
//     // data: { cid: cid.toString(), head: `${cid}${cid}${cid}` },
//     children,
//   }
// }

// const startValue: TreeNode<Bullet>[] = [bt(1, [bt(3), bt(4)]), bt(2)]

// const finalValues: TreeNode<Bullet>[][] = [
//   // insert
//   [bt(1, [bt(3), bt(4)]), bt(2), bt(5)],
//   [bt(1, [bt(3), bt(4), bt(8)]), bt(2), bt(5, [bt(6, [bt(7)])])],

//   // delete
//   [bt(1, [bt(4)])],

//   // insert + delete
//   [bt(6), bt(1, [bt(5), bt(4)]), bt(2, [bt(7)])],
//   [bt(1, [bt(3), bt(4)]), bt(2)],
// ]

// describe('TreeService', () => {
//   it('toList()', () => {
//     expect(TreeService.toList(startValue)).toMatchInlineSnapshot(`
//       Array [
//         Object {
//           "cid": "1",
//           "index": 0,
//           "parentCid": "TEMP_ROOT_CID",
//         },
//         Object {
//           "cid": "2",
//           "index": 1,
//           "parentCid": "TEMP_ROOT_CID",
//         },
//         Object {
//           "cid": "3",
//           "index": 0,
//           "parentCid": "1",
//         },
//         Object {
//           "cid": "4",
//           "index": 1,
//           "parentCid": "1",
//         },
//       ]
//     `)
//   })

//   it('fromList()', () => {
//     const list = TreeService.toList(startValue)
//     expect(TreeService.fromList(list)).toStrictEqual(TreeService.initPosition(startValue))
//   })

//   it('find()', () => {
//     expect(TreeService.find(startValue, node => node.cid.includes('4'))).toMatchInlineSnapshot(`
//       Array [
//         Object {
//           "cid": "4",
//           "index": 1,
//           "parentCid": "1",
//         },
//       ]
//     `)
//   })

//   it('toParentChildrenDict()', () => {
//     expect(TreeService.toParentChildrenDict(startValue)).toMatchInlineSnapshot(`
//       Object {
//         "1": Array [
//           Object {
//             "cid": "3",
//             "index": 0,
//             "parentCid": "1",
//           },
//           Object {
//             "cid": "4",
//             "index": 1,
//             "parentCid": "1",
//           },
//         ],
//         "2": Array [],
//         "3": Array [],
//         "4": Array [],
//         "TEMP_ROOT_CID": Array [
//           Object {
//             "cid": "1",
//             "index": 0,
//             "parentCid": "TEMP_ROOT_CID",
//           },
//           Object {
//             "cid": "2",
//             "index": 1,
//             "parentCid": "TEMP_ROOT_CID",
//           },
//         ],
//       }
//     `)
//   })

//   it.each(finalValues.map((e): [TreeNode<Bullet>[], null] => [e, null]))(
//     'toParentChildrenDict() <-> fromParentChildrenDict()',
//     value => {
//       const dict = TreeService.toParentChildrenDict(value)
//       expect(TreeService.fromParentChildrenDict(dict)).toStrictEqual(TreeService.initPosition(value))
//     },
//   )

//   it('insert()', () => {
//     const v = cloneDeep(startValue)
//     const item: MonoNode<Bullet> = { cid: 'x' }
//     expect(TreeService.insert(v, item, '1', -1)).toMatchInlineSnapshot(`
//       Array [
//         Object {
//           "children": Array [
//             Object {
//               "children": Array [],
//               "cid": "3",
//               "index": 0,
//               "parentCid": "1",
//             },
//             Object {
//               "children": Array [],
//               "cid": "4",
//               "index": 1,
//               "parentCid": "1",
//             },
//             Object {
//               "children": Array [],
//               "cid": "x",
//               "parentCid": "1",
//             },
//           ],
//           "cid": "1",
//           "index": 0,
//           "parentCid": "TEMP_ROOT_CID",
//         },
//         Object {
//           "children": Array [],
//           "cid": "2",
//           "index": 1,
//           "parentCid": "TEMP_ROOT_CID",
//         },
//       ]
//     `)
//     expect(TreeService.insert(v, item, TreeService.tempRootCid, 0)).toMatchInlineSnapshot(`
//       Array [
//         Object {
//           "children": Array [],
//           "cid": "x",
//           "parentCid": "TEMP_ROOT_CID",
//         },
//         Object {
//           "children": Array [
//             Object {
//               "children": Array [],
//               "cid": "3",
//               "index": 0,
//               "parentCid": "1",
//             },
//             Object {
//               "children": Array [],
//               "cid": "4",
//               "index": 1,
//               "parentCid": "1",
//             },
//           ],
//           "cid": "1",
//           "index": 0,
//           "parentCid": "TEMP_ROOT_CID",
//         },
//         Object {
//           "children": Array [],
//           "cid": "2",
//           "index": 1,
//           "parentCid": "TEMP_ROOT_CID",
//         },
//       ]
//     `)
//     // expect(TreeService.toParentChildrenDict(startValue)).toMatchInlineSnapshot()
//   })
// })

// // describe('TreeChangeService', () => {
// //   it.each(finalValues.map((e): [TreeNode<Bullet>[], null] => [e, null]))('compare with null doc', finalValue => {
// //     const startValue = null
// //     const changes = TreeChangeService.getChnages(finalValue, startValue, isEqual)
// //     const applied = TreeChangeService.applyChanges(startValue, changes)
// //     expect(NodeService.initPosition(applied)).toStrictEqual(NodeService.initPosition(finalValue))
// //   })

// //   it.each(finalValues.map((e): [TreeNode<Bullet>[], null] => [e, null]))('comapre with another doc', finalValue => {
// //     const changes = TreeChangeService.getChnages(finalValue, startValue, isEqual)
// //     // console.log(changes)
// //     const applied = TreeChangeService.applyChanges(startValue, changes)
// //     // console.log(inspect(NodeHelper.setPosition(applied), { depth: null }))
// //     expect(NodeService.initPosition(applied)).toStrictEqual(NodeService.initPosition(finalValue))
// //   })
// // })
