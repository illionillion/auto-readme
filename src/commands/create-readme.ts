import * as vscode from "vscode";
import {
  generateReadme,
  getGitignorePatterns,
  printTree,
  readDirRecursive,
  removeUserName,
  save_api_key,
  selectFile,
} from "../utils/utils";
import { Configuration, OpenAIApi } from "openai";
import { existsSync, readFileSync, writeFile } from "fs";
import { prompt_01, prompt_02 } from "../utils/prompts";
/**
 * READMEを作成するコマンド
 */
export const create_readme = async (openai: OpenAIApi | undefined) => {
  // APIキーを設定から取得
  let yourKey = vscode.workspace
    .getConfiguration("auto-readme")
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
    .getConfiguration("auto-readme")
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
        .getConfiguration("auto-readme")
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

  /**
   * 過去のREADMEを参照するかのフラグ
   */
  let pastFlag = false;
  const confirmReset = await vscode.window.showInformationMessage(
    "Reset exists README？",
    { modal: true },
    "Yes",
    "No"
  );
  vscode.window;

  if (confirmReset === undefined) {
    vscode.window.showErrorMessage("You selected cancel!");
    return;
  }
  if (confirmReset === "No") {
    // 実行する
    pastFlag = true;
  }
  // READMEのパスを取得
  vscode.window.showInformationMessage(`You selected "${confirmReset}"!`);
  const fileName = "README.md";
  const exportFilePath = `${vscode.workspace.workspaceFolders?.[0].uri.path.substring(
    1
  )}/${fileName}`;

  const pastFileContent = existsSync(exportFilePath)
    ? readFileSync(exportFilePath, "utf-8")
    : "";

  //ファイル選択
  const targetfilePath = await selectFile();
  if (!targetfilePath) {
    vscode.window.showErrorMessage("No file selected!");
    return;
  }
  vscode.window.showInformationMessage(
    `Selected file: ${removeUserName(targetfilePath)}`
  );

  // ワークスペースのフォルダパス取得
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage("No workspace folder found.");
    return;
  }
  // ワークスペースのフォルダ取得
  const workspaceFolderPath = workspaceFolders[0].uri.fsPath;

  const gitignores = getGitignorePatterns(workspaceFolderPath);
  // console.log(gitignores);
  // ツリーのルートを作成する
  const root = readDirRecursive(workspaceFolderPath, gitignores);
  // console.log(root);
  // アスキーアート出力
  const tree = printTree(root);
  // console.log(tree);

  const filecontent = readFileSync(targetfilePath, "utf-8");

  const content = (() => {
    if (pastFlag) {
      return prompt_02(filecontent, tree, pastFileContent);
    } else {
      return prompt_01(filecontent, tree);
    }
  })();
  // Progress message
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Creating README...",
      cancellable: false,
    },
    async () => {
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
