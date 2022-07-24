import { useRouter } from 'next/router'
// import { RenderElementProps } from 'slate-react'
// import classes from '../editor/editor.module.scss'
// import { InlineMirrorElement } from '../editor/slate-custom-types'
// import { DocPathService } from '../workspace/doc-path'

// const InlineMirror = ({
//   attributes,
//   children,
//   element,
//   sourceNoteId,
// }: RenderElementProps & {
//   element: InlineMirrorElement
//   sourceNoteId?: string
// }): JSX.Element => {
//   const router = useRouter()
//   return (
//     <span {...attributes} className="hover:cursor-pointer">
//       <button
//         className=" text-blue-500 hover:underline hover:underline-offset-2"
//         onClick={e => {
//           // e.preventDefault()
//           // e.stopPropagation()
//           router.push(
//             DocPathService.toURL(
//               element.mirrorSymbol.substring(2),
//               sourceNoteId,
//             ),
//           )
//         }}
//       >
//         {children}
//       </button>
//     </span>
//   )
// }

// export default InlineMirror

// // const FilterMirror = ({
// //   mirrors,
// //   sourceNoteId,
// // }: {
// //   mirrors: InlineMirrorElement[]
// //   sourceNoteId?: string
// // }): JSX.Element | null => {
// //   const [filteredBullet, setFilteredBullet] = useState<BulletDraft | null | undefined>()
// //   const client = useApolloClient()
// //   useEffect(() => {
// //     const asyncRun = async () => {
// //       if (mirrors.length === 1) {
// //         const mirror = mirrors[0]
// //         const { rootLi } = await getLocalOrQueryRoot({ client, mirrorSymbol: mirror.mirrorSymbol })
// //         const rootBulletDraft = Serializer.toRootBulletDraft(rootLi)
// //         const filtered = BulletNode.filter({
// //           node: rootBulletDraft,
// //           match: ({ node }) => node.sourceNoteId === sourceNoteId,
// //         })
// //         setFilteredBullet(filtered)
// //       }
// //     }
// //     asyncRun().catch(err => {
// //       console.error(err)
// //     })
// //   }, [])
// //   if (mirrors.length === 0) {
// //     return null
// //   }
// //   if (mirrors.length > 1) {
// //     return <div>一行只允許一個 mirror</div>
// //   }
// //   if (filteredBullet === undefined) {
// //     return null
// //   }
// //   if (filteredBullet === null) {
// //     return <div>Click to edit</div>
// //   }
// //   return (
// //     <ul className={classes.filterMirrorContainer}>
// //       {/* 忽略 root，從 root children 開始 render */}
// //       {filteredBullet.children.map((e, i) => (
// //         <BulletComponent key={i} bullet={e} />
// //       ))}
// //     </ul>
// //   )
// // }
