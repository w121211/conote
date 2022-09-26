import { writeBlocks } from '../../frontend/components/editor-textarea/src/utils/block-writer'
import { validateContentBlocks } from '../../share/utils'

describe('validateContentBlocks()', () => {
  it('checks is content empty', () => {
    expect(
      validateContentBlocks(writeBlocks(['Root', ['', '', '']])).isContentEmpty,
    ).toMatchInlineSnapshot(`true`)

    expect(
      validateContentBlocks(writeBlocks(['', ['', 'a', 'a']])).isContentEmpty,
    ).toMatchInlineSnapshot(`false`)

    expect(
      validateContentBlocks(writeBlocks(['Root', ['', ['', ['']]]]))
        .isContentEmpty,
    ).toMatchInlineSnapshot(`true`)

    expect(
      validateContentBlocks(writeBlocks(['', ['', ['', ['a']]]]))
        .isContentEmpty,
    ).toMatchInlineSnapshot(`false`)
  })
})
