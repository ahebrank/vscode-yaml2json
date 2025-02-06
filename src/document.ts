import * as vscode from 'vscode'

export class Document {
  static replaceSelection(editor: vscode.TextEditorEdit, selection: vscode.Selection, data: string): void {
    editor.replace(selection, data)
  }
  
  static replaceDocument(editor: vscode.TextEditorEdit, document: vscode.TextDocument, data: string, newFormat: string): void {
    const lastLineIndex = (document.lineCount - 1)
    let range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(lastLineIndex, Number.MAX_VALUE))
    range = document.validateRange(range)
    editor.replace(range, data)
    vscode.languages.setTextDocumentLanguage(document, newFormat)
  }
  
  static insert(editor: vscode.TextEditorEdit, selection: vscode.Selection, data: string): void {
    editor.insert(selection.active, data)
  }
}
