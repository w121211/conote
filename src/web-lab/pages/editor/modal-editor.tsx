import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Modal from 'react-modal'
import { ListEditor } from './list'

Modal.setAppElement('#__next')

// export const Post = ({ id, pathname }: { id?: string; pathname: string }) => {
//   return (
//     <div className={styles.post}>
//       I am the article {id}; my pathname is: {pathname}
//     </div>
//   )
// }

// const data = [1, 2, 3, 4, 5, 6, 7, 8, 9]

// const Grid = () => {
//   return (
//     <div className={styles.postCardGridWrapper}>
//       <h2>With QueryString Routing, and a reload won't use the modal</h2>
//       <div className={styles.postCardGrid}>
//         {data.map((id, index) => (
//           <Link
//             key={index}
//             href={`/modal/?postId=${id}`}
//             as={`/modal/post/${id}`}
//           >
//             <a className={styles.postCard}>{id}</a>
//           </Link>
//         ))}
//       </div>

//       <h2>With Dynamic Routing, and reloads will keep the modal</h2>
//       <div className={styles.postCardGrid}>
//         {data.map((id, index) => (
//           <Link
//             key={index}
//             href="/modal/article/[articleId]"
//             as={`/modal/article/${id}`}
//           >
//             <a className={styles.postCard}>{id}</a>
//           </Link>
//         ))}
//       </div>
//     </div>
//   )
// }

const Page = () => {
  const [showModal, setShowModal] = useState<boolean>(true)

  const router = useRouter()
  const postId = router.query.postId

  if (Array.isArray(postId)) {
    return <div>Post id is array</div>
  }
  return (
    <>
      <Modal
        // isOpen={postId !== undefined}
        isOpen={showModal}
        // onRequestClose={() => router.push('/editor/modal-editor')}
        onRequestClose={() => {
          setShowModal(false)
        }}
        contentLabel="Modal Editor"
      >
        {/* <Post id={postId} pathname={router.pathname} /> */}
        <ListEditor />
      </Modal>
      {/* <Grid /> */}

      <button
        onClick={() => {
          setShowModal(true)
        }}
      >
        Open modal editor
      </button>
      <ListEditor />
    </>
  )
}

export default Page
