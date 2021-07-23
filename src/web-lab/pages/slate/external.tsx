/**
 * Note:
 * - inline element不能是最後一個child(slate本身的限制)，會自動在最後加一個text -> 可能對render有問題
 * - inline 在輸入時會自動合併到text
 */
/* eslint-disable no-console */
import { BulletEditor } from '../../../web/components/editor/bullet-editor'

const TestPage = (): JSX.Element => {
  return (
    <div>
      <BulletEditor />
    </div>
  )
}

export default TestPage
