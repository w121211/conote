import { useRouter } from 'next/router'
import { BoardItem } from '../card'

const Board = (): JSX.Element => {
  const router = useRouter()
  const { id } = router.query
  if (id && typeof id === 'string') {
    return <BoardItem boardId={id} />
  }
  return <div>Empty</div>
}

export default Board
