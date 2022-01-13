import { useRouter } from 'next/router'
import { Post } from '../index'

const PostPage = () => {
  const router = useRouter()
  const { postId } = router.query

  if (typeof postId === 'string') {
    return <Post id={postId} pathname={router.pathname} />
  }
  return null
}

export default PostPage
