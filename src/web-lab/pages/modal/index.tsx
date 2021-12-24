import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#__next')

export const Post = ({ id, pathname }: { id?: string; pathname: string }) => {
  return (
    <div>
      I am the article {id}; my pathname is: {pathname}
    </div>
  )
}

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const Grid = () => {
  console.log('render <Grid />')
  // useEffect(() => {
  //   console.log('render <Grid />')
  // }, [])
  return (
    <div>
      <h2>With QueryString Routing, and a reload wont use the modal</h2>
      <div>
        {data.map((id, index) => (
          <p key={index}>
            <Link href={`/modal/?postId=${id}`} as={`/modal/post/${id}`}>
              <a>{id}</a>
            </Link>
          </p>
        ))}
      </div>

      <h2>With QueryString Routing, and a reload wont use the modal</h2>
      <div>
        {data.map((id, index) => (
          <p key={index}>
            <Link href={`/modal/?postId=${id}`} as={`/modal/post/${id}`}>
              <a>{id}</a>
            </Link>
          </p>
        ))}
      </div>

      <h2>With Dynamic Routing, and reloads will keep the modal</h2>
      <div>
        {data.map((id, index) => (
          <p key={index}>
            <Link href="/modal/article/[articleId]" as={`/modal/article/${id}`}>
              <a>{id}</a>
            </Link>
          </p>
        ))}
      </div>
    </div>
  )
}

const Page = () => {
  const router = useRouter()
  const [postId, setPostId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (router.isReady) {
      const { postId } = router.query
      // if (Array.isArray(postId)) {
      //   return <div{}>Unknwon URL</div>
      // }
      if (typeof postId === 'string') {
        setPostId(postId)
      } else {
        setPostId(null)
      }
    }
  }, [router])

  // const postId = router.query.postId
  // const grid = useMemo(() => <Grid />, [])

  return (
    <div>
      <Modal
        isOpen={postId !== null}
        onRequestClose={() => {
          router.push('/modal')
        }}
        // isOpen={showModal}
        // onRequestClose={() => {
        //   setShowModal(false)
        // }}
        contentLabel="Post modal"
      >
        {/* <Post id={postId} pathname={router.pathname} /> */}
        <div>Hello world</div>
      </Modal>
      <Grid />
      {/* {grid} */}
      {/* <button
        onClick={() => {
          window.history.replaceState(
            {
              ...window.history.state,
              as: '/modal?postId=1',
              url: '/modal?postId=1',
            },
            window.history.state,
            '',
            '/modal?postId=1'
          )
        }}
      >
        Replace URL
      </button> */}
      <button
        onClick={() => {
          setShowModal(true)
        }}
      >
        modal
      </button>
    </div>
  )
}

export default Page
