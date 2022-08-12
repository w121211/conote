import { createStore, select, setProp, withProps } from '@ngneat/elf'

type EditorProps = {
  curSelectedElId: string | null
}

export const editorStore = createStore(
  { name: 'editorStore' },
  withProps<EditorProps>({
    curSelectedElId: null,
  }),
)

class SlateEditorRepository {
  curSelectedElId$ = editorStore.pipe(select(state => state.curSelectedElId))

  getValue() {
    return editorStore.getValue()
  }

  setCurSelectedElId(prop: EditorProps['curSelectedElId']) {
    editorStore.update(setProp('curSelectedElId', prop))
  }
}

export const slateEditorRepo = new SlateEditorRepository()
