import { save_api_key } from "../utils/utils";
import * as vscode from "vscode";

/**
 * APIキー設定コマンド
 */
export const set_api_key = async () => {
  const yourKey = await vscode.window.showInputBox({
    prompt: "Enter your ChatGPT API Key.",
  });
  await save_api_key(yourKey ?? "");
};
