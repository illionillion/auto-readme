import { readFileSync, writeFile } from "fs";
import * as vscode from "vscode";
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";
import * as dotenv from "dotenv";
dotenv.config({ path: "/path/to/.env" });

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
  console.log(answer);
  return answer;
};

export function activate(context: vscode.ExtensionContext) {
  /**
   * README作成
   */
  const create = vscode.commands.registerCommand(
    "create-readme-openai.create-readme",
    async () => {
      const yourKey = await vscode.window.showInputBox({
        prompt: "Enter your Key.",
      });
      if (!yourKey) {
        vscode.window.showErrorMessage("No Enter your Key!");
        return;
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
          "All Files": ["*"],
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
      console.log(filecontent);

      const content = `以下のソースコードのREADMEを日本語で作成してください。\n${filecontent}`;
      console.log(content);

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
