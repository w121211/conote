import { setEntities } from '@ngneat/elf-entities'
import { blockRepo } from '../../../frontend/components/block-editor/src/stores/block.repository'
import { docRepo } from '../../../frontend/components/block-editor/src/stores/doc.repository'
import { mockBlocks } from '../../../frontend/components/block-editor/test/__mocks__/mock-block'
import { mockDocs } from '../../../frontend/components/block-editor/test/__mocks__/mock-doc'

export const InitStoreForStorybook = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  // (BUG) useEffect throws error, possibly caused by storybook
  // useEffect(() => {
  //   blockRepo.clearHistory()
  //   blockRepo.update([setEntities(mockBlocks)])
  //   docRepo.update([setEntities(mockDocs)])
  // }, [])

  blockRepo.clearHistory()
  blockRepo.update([setEntities(mockBlocks)])
  docRepo.update([setEntities(mockDocs)])

  return <>{children}</>
}
