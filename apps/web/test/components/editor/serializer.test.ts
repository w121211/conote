import { TreeNode } from '@conote/docdiff'
import { EditorSerializer } from '../../../components/editor/serializer'

const bt = (id: number, children: TreeNode<Bullet>[] = []): TreeNode<Bullet> => {
  return {
    cid: id.toString(),
    data: { id: id.toString(), head: `${id}${id}${id}` },
    children,
    change: undefined,
  }
}

const value: TreeNode<Bullet>[] = [bt(1, [bt(3), bt(4)]), bt(2)]

it('toLiArray() + toTreeNodes()', () => {
  const lis = EditorSerializer.toLiArray(value)
  // expect(lis).toStrictEqual([])
  expect(EditorSerializer.toTreeNodes(lis)).toStrictEqual(value)
})
