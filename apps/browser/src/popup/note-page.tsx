/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react'
// import { QueryDataProvider } from '../../../web/components/data-provider'
// import { NoteHead, NoteBody } from '../../../web/components/note'
// import { NoteForm } from '../../../web/components/note-form'
// import { useNoteQuery, NoteQuery } from '../../../web/apollo/query.graphql'

// function getTabUrl(): string | null {
//   let url: string | null
//   if (window.location.protocol.includes('extension')) {
//     // popup的情況
//     const params = new URLSearchParams(new URL(window.location.href).search)
//     url = params.get('u')
//   } else {
//     // inject的情況
//     url = window.location.href
//   }

//   return url
// }

// export function NotePage(): JSX.Element {
//   const [edit, setEdit] = useState<boolean>(false)
//   const [symbol, setSymbol] = useState('')
//   const [urlState, setUrlState] = useState('')
//   const [path, setPath] = useState<string[]>([])
//   // useEffect(() => {
//   //   const url = getTabUrl()
//   //   if (url) {
//   //     setUrlState(url)
//   //     // setQueryVar(url)
//   //     setPath([url])
//   //   }
//   // }, [])
//   // useEffect(() => {
//   //   if (path[path.length - 1].includes('[[') && path[path.length - 1].includes(']]')) {
//   //     setSymbol(path[path.length - 1])
//   //   } else {
//   //     setUrlState(path[path.length - 1])
//   //   }
//   // }, [path])
//   // const {data:webPageData,loading:webPageLoading,error:webPageError}=useWebpageNoteQuery({variables:{url:urlState}})
//   // const { data, loading, error } = useNoteQuery({ variables: { symbol} })

//   // if (data) {
//   // if ((data && data.note)||(webPageData&&webPageData.webpageNote)) {
//   // const editor = new Editor(
//   //   data.note.body?.text,
//   //   data.note.body?.meta,
//   //   data.note.link?.url,
//   //   data.note.link?.oauthorName ?? undefined,
//   // )
//   // editor.flush({ attachMarkerlinesToTokens: true })
//   // const sect = editor.getSections()
//   return (
//     // <QueryDataProvider
//     //   useQuery={() => useConoteQuery({ variables: { url } })}
//     //   render={(data: ConoteQuery) => {
//     // const url = `/note/form?${getNoteUrlParam(data.conote)}`
//     // return (
//     <div>
//       {/* <button
//           onClick={() => {
//             setEdit(!edit)
//           }}
//         >
//           編輯
//         </button> */}

//       {/* <NoteIndex /> */}

//       {/* <NoteHead note={data.conote} sect={sect} height={0} />
//         {edit ? (
//           <NoteForm note={data.conote} />
//         ) : (
//           <NoteBody
//             note={data.conote}
//             clickPoll={() => {}}
//             anchorIdHandler={() => {}}
//             showDiscuss={() => {}}
//             anchorIdHL={''}
//             hlElementHandler={() => {}}
//             pathPush={() => {
//               setPath
//             }}
//             // symbolHandler={()=>{setSymbol}}
//           />
//         )} */}
//     </div>
//     // )
//     // }
//     // return null
//     // }}
//     // />
//   )
//   // }
//   // if (symbol) {
//   //   try {
//   //     symbolToUrl(symbol)
//   //     return _render(undefined, symbol)
//   //   } catch {
//   //     return <h1>Symbol format error</h1>
//   //   }
//   // }
// }
// // return <h1>Require URL or Symbol (現階段還未支援symbol)</h1>
// // }
