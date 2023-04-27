import * as vscode from "vscode";
import { OpenAIApi } from "openai";
import { create_readme } from "./commands/create-readme";
import { set_api_key } from "./commands/set-api-key";
import { ReadmeStatusBarItem } from "./commands/statusBarItem";
import { checkNewVersion, checkOldExtension } from "./utils/utils";

let readmeStatusBarItem: ReadmeStatusBarItem;
let openai: OpenAIApi | undefined = undefined;
export async function activate(context: vscode.ExtensionContext) {
  
  if(!checkOldExtension()) { // チェックして旧版でなければ、バージョン確認を行いたい
    // ここでバージョン確認
    await checkNewVersion()
  };

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
