// function withAutoComplete(editor: Editor): Editor {
//   const { insertText } = editor
//   editor.insertText = (text: string) => {
//     if (text === '[') {
//       Transforms.insertText(editor, '[]')
//       Transforms.move(editor, { reverse: true })
//       return
//     }
//     insertText(text)
//   }
//   return editor
// }
