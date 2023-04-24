import * as vscode from "vscode";
import { OpenAIApi } from "openai";
import { create_readme } from "./commands/create-readme";
import { set_api_key } from "./commands/set-api-key";
import { ReadmeStatusBarItem } from "./commands/statusBarItem";

let readmeStatusBarItem: ReadmeStatusBarItem;
let openai: OpenAIApi | undefined = undefined;
//src\commands\statusBarItem.ts
export function activate(context: vscode.ExtensionContext) {
  /**
   * README作成
   */
  const create = vscode.commands.registerCommand(
    "create-readme-openai.create-readme",
    async () => await create_readme(openai)
  );

  /**
   * APIキー設定
   */
  const setAPIKey = vscode.commands.registerCommand(
    "create-readme-openai.set-api-key",
    set_api_key
  );

  const readmeStatusBarItem = new ReadmeStatusBarItem();

  context.subscriptions.push(create); // イベント追加
  context.subscriptions.push(setAPIKey); // イベント追加
  context.subscriptions.push(readmeStatusBarItem);
}

// This method is called when your extension is deactivated

export function deactivate() {
  if (readmeStatusBarItem) {
    readmeStatusBarItem.dispose();
  }
}
