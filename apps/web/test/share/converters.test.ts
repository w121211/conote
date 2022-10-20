import { writeBlocks } from '../../frontend/components/editor-textarea/src/utils/block-writer'
import { mockBlockInputs } from '../../frontend/components/editor-textarea/test/__mocks__/mock-block'
import { blocksToText } from '../../share/converters'

describe('blocksToText()', () => {
  it('checks is content empty', () => {
    const blocks = writeBlocks(mockBlockInputs[1])

    expect(blocksToText(blocks)).toMatchInlineSnapshot(`
      "* # H1 heading
        * ## H2 heading
          * Excepteur sint occaecat *cupidatat* non **proident**.
            * Pellentesque habitant morbi tristique senectus et netus et.  
      Vitae elementum curabitur vitae nunc.
            * Eu non diam phasellus vestibulum lorem. Non curabitur gravida arcu ac tortor dignissim convallis aenean et. Vitae elementum curabitur vitae nunc sed velit dignissim sodales. Volutpat est velit egestas dui id ornare arcu.
          * ### H3 heading
            * Paragraph node.
              * Indented node.
            * A line break is \`space + space + \\\\n\`  
      This is second line.
            * Inline code \`inline code\`
        * ### H3 heading
          * Paragraph node.
            * Indented paragraph node. https://finance.yahoo.com/
        * ### List
          * List item.
            * Indented paragraph node.
          * List item.
            * Indented paragraph node.
          * List item.
            * Indented paragraph node.
      * # Syntax mix
        * ### Heading + #A discussion with id, where id should not render.-cl7dhm6rn000h2e6d83bt99am#
        * ### Heading + [[symbol]]
        * ### Heading + // Comment ...
        * ### Paragraph + X
          * Paragraph + #discussion with id-cl7dhm6rn000h2e6d83bt99am# ...
          * Paragraph + #discussion without id# ...
          * Paragraph + [[symbol]] ...
          * Paragraph + ...  // Comment ...
        * ### X + Paragraph
          * #discussion# paragraph ...
          * [[symbol]] paragraph ...
      * # Paragraph follow by heading // This is prompt to be a wrong style, only testing the render result.
        * Paragraph
        * ### Paragraph child 1 as heading // Heading should ignore the indent
          * Paragraph reset the indent
            * Paragraph follow by its parent
        * Paragraph child 2
          * #discussion# paragraph ...
          * [[symbol]] paragraph ...
      * # Debug format
        * ##
        * a
          * b
            * [[c]]"
    `)
  })
})
