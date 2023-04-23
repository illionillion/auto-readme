import * as vscode from "vscode";
import { AxiosError } from "axios";
import { ChatCompletionRequestMessageRoleEnum, OpenAIApi } from "openai";

/**
 * 共通のモジュール
 */

/**
 * Axiosエラーか判定
 * @param error
 * @returns
 */
export const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError)?.isAxiosError === true;
};

/**
 * APIキーの保存
 * @param yourKey
 */
export const save_api_key = async (yourKey: string) => {
  await vscode.workspace
    .getConfiguration("create-readme-openai")
    .update("apiKey", yourKey, vscode.ConfigurationTarget.Global);
  vscode.window.showInformationMessage("API Key saved to settings.");
};

/**
 * README作成関数
 * @param content
 * @param model
 * @param role
 * @returns
 */
export const generateReadme = async (
  content: string,
  model = "gpt-3.5-turbo",
  role: ChatCompletionRequestMessageRoleEnum = "user",
  openai: OpenAIApi | undefined
) => {
  try {
    const response = await openai?.createChatCompletion({
      model: model,
      messages: [{ role: role, content: content }],
    });

    const answer = response?.data.choices[0].message?.content;
    return { success: true, content: answer };
  } catch (error) {
    if (isAxiosError(error) && error?.response?.status === 403) {
      // 通信失敗時
      return {
        success: false,
        content: "An error occurred during the request. Please try again.",
      };
    } else {
      // APIキーが違うなど
      return {
        success: false,
        content:
          "An error occurred during the request. Plese check your API key and model",
      };
    }
  }
};
