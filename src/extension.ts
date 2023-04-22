import { readFileSync, writeFile } from "fs";
import * as vscode from "vscode";
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

let openai: OpenAIApi | undefined = undefined;

export const generateReadme = async (
  content: string,
  model = "gpt-3.5-turbo-0301",
  role: ChatCompletionRequestMessageRoleEnum = "user"
) => {
  const response = await openai?.createChatCompletion({
    model: model,
    messages: [{ role: role, content: content }],
  });

  const answer = response?.data.choices[0].message?.content;
  return answer;
};

export function activate(context: vscode.ExtensionContext) {
  /**
   * README作成
   */
  const create = vscode.commands.registerCommand(
    "create-readme-openai.create-readme",
    async () => {
      // APIキーを設定から取得
      let yourKey = vscode.workspace
        .getConfiguration("create-readme-openai")
        .get("apiKey") as string | undefined;

      // APIキーが設定されていない場合、実行時に入力を求める
      if (!yourKey) {
        yourKey = await vscode.window.showInputBox({
          prompt: "Enter your OpenAI API Key.",
        });

        // 入力がキャンセルされた場合
        if (!yourKey) {
          vscode.window.showErrorMessage(
            "No API key entered! Please set your OpenAI API key in the settings or enter it when prompted."
          );
          return;
        } else {
          // 入力されたAPIキーを設定に保存する
          await vscode.workspace
            .getConfiguration("create-readme-openai")
            .update("apiKey", yourKey, vscode.ConfigurationTarget.Global);
          vscode.window.showInformationMessage("API Key saved to settings.");
        }
      }

      const configuration = new Configuration({
        apiKey: yourKey,
      });
      openai = new OpenAIApi(configuration);

      const fileName = "README.md";
      const exportFilePath = `${vscode.workspace.workspaceFolders?.[0].uri.path}/${fileName}`;

      const options = {
        canSelectMany: false,
        openLabel: "Select",
        filters: {
          all_files: ["*"],
        },
      };
      const targetFileUri = await vscode.window.showOpenDialog(options);
      if (!targetFileUri) {
        vscode.window.showErrorMessage("No file selected!");
        return;
      }
      const targetfilePath = targetFileUri[0].fsPath;
      vscode.window.showInformationMessage(`Selected file: ${targetfilePath}`);
      const filecontent = readFileSync(targetfilePath, "utf-8");

      const content = `以下のソースコードのREADMEを日本語で作成してください。\n${filecontent}`;
      // Progress message
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Creating README...",
          cancellable: false,
        },
        async (progress) => {
          progress.report({ increment: 0 });
          const result = await generateReadme(content);
          writeFile(exportFilePath, result ?? "", (err) => {
            if (err) {
              vscode.window.showErrorMessage(
                `Failed to create file: ${err.message}`
              );
              return;
            }
            vscode.window.showInformationMessage(
              `File ${fileName} created successfully!`
            );
          });
        }
      );
    }
  );

  context.subscriptions.push(create);
}

// This method is called when your extension is deactivated
export function deactivate() {}
