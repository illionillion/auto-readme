import * as vscode from "vscode";
import { generateReadme, save_api_key } from "../utils/utils";
import { Configuration, OpenAIApi } from "openai";
import { readFileSync, writeFile } from "fs";

/**
 * READMEを作成するコマンド
 */
export const create_readme = async (openai: OpenAIApi | undefined) => {
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
      await save_api_key(yourKey);
    }
  }

  // モデル名を設定から取得
  let modelName = vscode.workspace
    .getConfiguration("create-readme-openai")
    .get("model") as string | undefined;

  // モデル名が設定されていない場合、実行時に選択を求める
  if (!modelName) {
    const modelQuickPickItems: vscode.QuickPickItem[] = [
      {
        label: "gpt-3.5-turbo",
        description: "GPT-3.5 Turbo model",
      },
      {
        label: "gpt-4",
        description: "gpt-4 model",
      },
    ];

    const selectedModel = await vscode.window.showQuickPick(
      modelQuickPickItems,
      {
        placeHolder: "Select your OpenAI model.",
      }
    );

    // 選択がキャンセルされた場合
    if (!selectedModel) {
      vscode.window.showErrorMessage(
        "No model selected! Please set your OpenAI model in the settings or select it when prompted."
      );
      return;
    } else {
      // 選択されたモデル名を設定に保存する
      modelName = selectedModel.label;
      await vscode.workspace
        .getConfiguration("create-readme-openai")
        .update("model", modelName, vscode.ConfigurationTarget.Global);

      vscode.window.showInformationMessage(
        "Model selected and saved to settings."
      );
    }
  }

  const configuration = new Configuration({
    apiKey: yourKey,
  });
  openai = new OpenAIApi(configuration);

  const fileName = "README.md";
  const exportFilePath = `${vscode.workspace.workspaceFolders?.[0].uri.path.substring(
    1
  )}/${fileName}`;

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
      const result = await generateReadme(content, modelName, "user", openai);
      if (result.success) {
        writeFile(exportFilePath, result.content ?? "", (err) => {
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
      } else {
        vscode.window.showErrorMessage(result.content ?? "");
      }
    }
  );
};
