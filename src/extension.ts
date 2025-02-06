'use strict'
import * as vscode from 'vscode'
import { Command } from './command'

export function activate(context: vscode.ExtensionContext) {
  // Update hooks.
  const extension = vscode.extensions.getExtension('ahebrank.yaml2json')
  if (extension) {
    if (!context.globalState.get('spaceSettingUpdated', false) && extension.packageJSON.version == "0.0.9") {
      // Make sure we only do this once.
      context.globalState.update('spaceSettingUpdated', true)
      // Set the yamlIndentationSpaces setting based on the workspace tabSize
      // to keep behavior consistent with previous versions.
      const wsSpaces = vscode.workspace.getConfiguration('editor').get('tabSize')
      // If there's a tabSize setting override the extension setting.
      if (wsSpaces) {
        vscode.workspace.getConfiguration('yaml2json').update('yamlIndentationSpaces', wsSpaces, vscode.ConfigurationTarget.Global)
          .then(() => {
            vscode.window.showInformationMessage('Setting YAML indentation to match workspace tabSize setting ' + wsSpaces)
          }, (error) => {
            console.error('Unable to update yamlIndentationSpaces setting: ' + error)
          })
      }
    }
  }
  
  // Register extension commands.
  const commands = [
    vscode.commands.registerCommand(`yaml2json.document`, () => Command.convertDocument()),
    vscode.commands.registerCommand(`yaml2json.clipboard`, () => Command.convertClipboard()),
  ]
  
  context.subscriptions.push(...commands)
}

export function deactivate() {
}
