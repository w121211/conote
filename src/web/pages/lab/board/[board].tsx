import { useRouter } from 'next/router'
import { BoardItem } from '../card'
const Board = () => {
  const router = useRouter()
  const { board } = router.query
  return board && typeof board === 'string' && <BoardItem boardId={board} />
}
export default Board
