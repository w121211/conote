import { setEntities } from '@ngneat/elf-entities'
import { blockRepo } from '../../../components/block-editor/src/stores/block.repository'
import { docRepo } from '../../../components/block-editor/src/stores/doc.repository'
import { mockBlocks } from '../../../components/block-editor/test/__mocks__/mock-block'
import { mockDocs } from '../../../components/block-editor/test/__mocks__/mock-doc'

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
