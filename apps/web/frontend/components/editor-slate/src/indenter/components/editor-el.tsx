import { useCallback, useMemo, useState } from 'react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react'
import { ElementIndenter } from '../../interfaces'
import { isIndenterArray } from '../normalizers'
import { indenterOnKeyDown } from '../onkeydown-indenter'
import { withIndenter } from '../with-indenter'
import IndenterEl from './IndenterEl'

const CustomElement = (props: RenderElementProps) => {
  const { element, ...restProps } = props

  switch (element.type) {
    case 'indenter': {
      return <IndenterEl {...{ ...restProps, element }} />
    }
    default: {
      throw new Error('Only allow indenter element')
    }
  }
}

export const EditorEl = ({
  initialValue,
}: {
  initialValue: ElementIndenter[]
}) => {
  const renderElement = useCallback(
      (props: RenderElementProps) => <CustomElement {...props} />,
      [],
    ),
    editor = useMemo(
      () => withIndenter(withHistory(withReact(createEditor()))),
      [],
    ),
    [value, setValue] = useState(initialValue)

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={v => {
        if (isIndenterArray(v)) {
          setValue(v)
        } else {
          throw new Error('Value needs to be indenter array')
        }
      }}
    >
      <Editable
        renderElement={renderElement}
        onKeyDown={e => {
          return indenterOnKeyDown(e, editor)
        }}
      />
    </Slate>
  )
}
