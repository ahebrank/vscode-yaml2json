import * as vscode from 'vscode'
import { Document } from './document'
const yamljs = require('yamljs')
const clipboardy = require('clipboardy')
const unescape = require('lodash.unescape')

const DOCUMENT_ERROR = 'Selection or document is invalid YAML or JSON???'
const CLIPBOARD_ERROR = 'Clipboard is invalid YAML or JSON???'

export class Command {
  
  static convertDocument(): void {
    const activeEditor = vscode.window.activeTextEditor
    if (activeEditor && activeEditor.selection && activeEditor.selection.active) {
      activeEditor.edit(editor => {
        const select = activeEditor.document.getText(activeEditor.selection)
        let input = select || activeEditor.document.getText()
        const callback = (err, result, newFormat) => {
          if (err || !result) {
            vscode.window.showErrorMessage(DOCUMENT_ERROR)
          } else {
            if (select) {
              Document.replaceSelection(editor, activeEditor.selection, result)
            } else {
              Document.replaceDocument(editor, activeEditor.document, result, newFormat)
            }
          }
        }
        
        this._convert(input, callback)
      })
    }
  }
  
  static convertClipboard(): void {
    const activeEditor = vscode.window.activeTextEditor
    if (activeEditor && activeEditor.selection && activeEditor.selection.active) {
      activeEditor.edit(editor => {
        const select = activeEditor.document.getText(activeEditor.selection)
        
        let input = clipboardy.readSync()
        const callback = (err, result, newFormat) => {
          if (err || !result) {
            vscode.window.showErrorMessage(CLIPBOARD_ERROR)
          } else {
            if (select) {
              Document.replaceSelection(editor, activeEditor.selection, result)
            } else {
              Document.insert(editor, activeEditor.selection, result)
            }
          }
        }
        
        this._convert(input, callback)
      })
    }
  }
  
  static _convert(input, callback): void {
    const settings = vscode.workspace.getConfiguration('yaml2json')
    input = unescape(input)
    try {
      // Assume a successful JSON parse means we're converting JSON->YAML
      const json = JSON.parse(input)
      // Second parameter controls depth before inlining structures.
      // Third parameter is the number of spaces for indentation. TIL YAML requires spaces, but doesn't care how many.
      const yaml = yamljs.stringify(json, settings.get('yamlExpansionDepth'), settings.get('yamlIndentationSpaces'))
      callback(null, yaml, 'yaml')
    }
    // Otherwise, YAML->JSON?
    catch {
      try {
        const js = yamljs.parse(input)
        callback(null, JSON.stringify(js, null, 2), 'json')
      }
      catch (e) {
        callback(e)
      }
    }
  }
}
