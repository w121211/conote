// import React, { useState, Fragment } from 'react'
// import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
// import { Link, Router, RouteComponentProps } from '@reach/router'
// import { AutoComplete } from 'antd'
// import * as queries from '../../store/queries'
// import * as QT from '../../store/queryTypes'

// const mockVal = (str: string, repeat: number = 1) => {
//   return {
//     value: str.repeat(repeat),
//   };
// };

// function SymbolSearchForm() {
//   const [value, setValue] = useState('');
//   const [options, setOptions] = useState<{ value: string }[]>([]);
//   const onSearch = (searchText: string) => {
//     setOptions(
//       !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)],
//     );
//   };
//   const onSelect = (data: string) => {
//     console.log('onSelect', data);
//   };
//   const onChange = (data: string) => {
//     setValue(data);
//   };
//   return (
//     <div>
//       <AutoComplete
//         options={options}
//         style={{ width: 200 }}
//         onSelect={onSelect}
//         onSearch={onSearch}
//         placeholder="input here"
//       />
//       <br />
//       <br />
//       <AutoComplete
//         value={value}
//         options={options}
//         style={{ width: 200 }}
//         onSelect={onSelect}
//         onSearch={onSearch}
//         onChange={onChange}
//         placeholder="control mode"
//       />
//     </div>
//   );
// }

// interface LinkPostProps {
//   // page: QT.fetchPage_fetchPage
// }

// // const LinkPostForm: React.FC<LinkPostProps> = () => {
// //   // const {
// //   //   createdPost,
// //   //   suggestTitle,
// //   //   suggestTags,
// //   //   suggestEvents,
// //   //   suggestTickers,
// //   //   createdEvent } = page
// //   const [createPost, { data, loading, error }] = useMutation<QT.createPost, QT.createPostVariables>(
// //     // queries.CREATE_POST
// //     queries.BLOCK,
// //   )
// //   // const { register, handleSubmit, setValue, errors } = useForm({
// //   //   defaultValues: {
// //   //     title: page.suggestTitle,
// //   //     tags: page.suggestTags,
// //   //     events: page.suggestEvents,
// //   //     tickers: page.suggestTickers,
// //   //     text: "some comments goes here",
// //   //   }
// //   // })
// //   // const onSubmit = (data: any) => {
// //   //   // createPost({
// //   //   //   variables: {
// //   //   //     data: {
// //   //   //       cat: QT.PostCat.LINK,
// //   //   //       title: page.title,
// //   //   //       // symbols: page.symbols,
// //   //   //     }
// //   //   //   }
// //   //   // })
// //   // }

// //   if (loading) return <p>Loading...</p>
// //   if (error) return <p>ERROR: {error.message}</p>
// //   if (data?.createPost.id) return <Link to={`/post/${data.createPost.id}`}>Post Created</Link>

// //   return (
// //     <>
// //       <h1>Page fetched, create a new link-post</h1>

// //       {/* <form onSubmit={handleSubmit(onSubmit)}>
// //         <div>
// //           <label htmlFor="title">title</label>
// //           <input
// //             name="title"
// //             placeholder="title..."
// //             ref={register}
// //           />
// //         </div>

// //         <div>
// //           <label htmlFor="content">content</label>
// //           <input
// //             name="content"
// //             placeholder="body..."
// //             ref={register}
// //           />
// //         </div>

// //         <button type="submit">
// //           Submit
// //       </button>

// //       </form> */}
// //     </>
// //   )
// // }

// // function FetchPageForm() {
// //   // const [fetchPage, { data, loading, error }] = useLazyQuery<QT.fetchPage, QT.fetchPageVariables>(
// //   //   queries.FETCH_PAGE,
// //   // )
// //   // const { register, handleSubmit, setValue, errors } = useForm({
// //   //   defaultValues: {
// //   //     link: "http://some.url"
// //   //   }
// //   // })
// //   // const onSubmit = (data: any) => {
// //   //   console.log(data)
// //   //   fetchPage({ variables: { url: data.link } })
// //   // }

// //   // if (loading) return <p>Loading...</p>
// //   // if (error) return <p>ERROR: {error.message}</p>
// //   // if (!data) return <p>Fetch page failed</p>
// //   // // if (data?.fetchPage.post) return <Link to={`/post/${data.fetchPage.post.id}`}>Post Existed (Redirect)</Link>
// //   // if (data.fetchPage.createdPostId) return (
// //   //   <p>
// //   //     URL has been created: <Link to={`/post/${data.fetchPage.createdPostId}`}>post</Link>
// //   //   </p>
// //   // )
// //   // if (data.fetchPage) return <LinkPostForm page={data.fetchPage} />

// //   return (<></>
// //     // <form onSubmit={handleSubmit(onSubmit)}>

// //     //   <div>
// //     //     <label htmlFor="link">link</label>
// //     //     <input
// //     //       name="link"
// //     //       placeholder="http://"
// //     //       ref={register}
// //     //     />
// //     //   </div>

// //     //   <button type="submit">
// //     //     Submit
// //     // </button>

// //     // </form>
// //   )
// // }


// // interface PostFormProps {
// //   cat: QT.PostCat
// // }

// // export const PostForm: React.FC<PostFormProps> = ({ cat }) => {
// //   return null
// // }



