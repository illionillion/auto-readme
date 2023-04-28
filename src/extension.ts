import * as vscode from "vscode";
import { OpenAIApi } from "openai";
import { create_readme } from "./commands/create-readme";
import { set_api_key } from "./commands/set-api-key";
import { ReadmeStatusBarItem } from "./commands/statusBarItem";
import { checkNewVersion, checkOldExtension, get_api_key, redirectToSetting } from "./utils/utils";

let readmeStatusBarItem: ReadmeStatusBarItem;
let openai: OpenAIApi | undefined = undefined;
export async function activate(context: vscode.ExtensionContext) {
  
  if(!checkOldExtension()) { // チェックして旧版でなければ、バージョン確認を行いたい
    // ここでバージョン確認
    await checkNewVersion()
  };

  const get_key = await get_api_key(); // キーが設定されているか確認
  if (get_key === "" || get_key === undefined) {
    await redirectToSetting() // されていなければ設定画面へ移動するか確認
  }  

  /**
   * README作成
   */
  const create = vscode.commands.registerCommand(
    "auto-readme.create-readme",
    async () => await create_readme(openai)
  );  

  /**
   * APIキー設定
   */
  const setAPIKey = vscode.commands.registerCommand(
    "auto-readme.set-api-key",
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
