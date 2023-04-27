import * as vscode from "vscode";
import { OpenAIApi } from "openai";
import { create_readme } from "./commands/create-readme";
import { set_api_key } from "./commands/set-api-key";
import { ReadmeStatusBarItem } from "./commands/statusBarItem";
import { checkOldExtension } from "./utils/utils";

let readmeStatusBarItem: ReadmeStatusBarItem;
let openai: OpenAIApi | undefined = undefined;
export function activate(context: vscode.ExtensionContext) {
  checkOldExtension();

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

export function deactivate() {
  if (readmeStatusBarItem) {
    readmeStatusBarItem.dispose();
  }
}
