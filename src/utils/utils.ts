import * as vscode from "vscode";
import { AxiosError } from "axios";
import { ChatCompletionRequestMessageRoleEnum, OpenAIApi } from "openai";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import * as micromatch from "micromatch";

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
    } else if (
      isAxiosError(error) &&
      error.response?.data.error.code === "context_length_exceeded"
    ) {
      // トークン不足時
      return {
        success: false,
        content:
          "An error occurred during the request. The file size is too large. Please choose another file or format the code in the file.",
      };
    } else {
      // APIキーが違うなど
      return {
        success: false,
        content:
          "An error occurred during the request. Please check your API key and model",
      };
    }
  }
};
interface TreeNode {
  label: string;
  nodes?: TreeNode[];
}
/**
 * フォルダの配下のtreeを取得
 * @param path パス
 * @param ignores ignoreで除外されているもの
 * @returns
 */
export const readDirRecursive = (
  path: string,
  ignores: string[] = []
): TreeNode => {
  const stats = statSync(path);

  if (stats.isDirectory()) {
    const folderName = path.split("/").pop() as string;
    const children = readdirSync(path)
      .filter((child) => !/(^|\/)\.[^\/\.]/g.test(child)) // ドットで始まるフォルダを除外する
      .filter((child) => ignores.indexOf(child) === -1) // ignoresに記載されたフォルダを除外する
      .map((child) => readDirRecursive(join(path, child), ignores));

    return { label: folderName, nodes: children };
  } else {
    return { label: path.split("/").pop() as string };
  }
};

/**
 * gitignoreの内容取得
 * @param workspacePath
 * @returns
 */
export const getGitignorePatterns = (workspacePath: string): string[] => {
  const gitignorePath = join(workspacePath, ".gitignore");

  if (existsSync(gitignorePath)) {
    const gitignoreContent = readFileSync(gitignorePath, "utf8");
    return gitignoreContent
      .split("\n")
      .filter((line) => !line.startsWith("#") && line.trim() !== "")
      .map((line)=>line.replace("/", ""));
  } else {
    return [];
  }
};

/**
 * ツリー表示
 * @param tree
 * @param depth
 * @param isLast
 * @returns
 */
export const printTree = (tree: TreeNode, depth = 0, isLast = true): string => {
  const LINE = "│  ";
  const BRANCH = isLast ? "└──" : "├──";
  const indent = " ".repeat(depth * 4);
  let treeStr = `${indent}${BRANCH}${tree.label}\n`;

  if (tree.nodes) {
    const lastIndex = tree.nodes.length - 1;
    tree.nodes.forEach((node, index) => {
      const isLastNode = index === lastIndex;
      treeStr += printTree(node, depth + 1, isLastNode);
      if (!isLastNode) {
        treeStr += `${indent}${isLast ? "   " : LINE}`;
      }
    });
  }
  return treeStr;
};

/**
 * フォルダ選択
 * @returns
 */
export const selectFolder = async (): Promise<string | undefined> => {
  const options: vscode.OpenDialogOptions = {
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
  };

  const folderUri = await vscode.window.showOpenDialog(options);

  if (folderUri && folderUri.length > 0) {
    return folderUri[0].fsPath;
  }

  return undefined;
};

/**
 * ファイル選択
 * @returns
 */
export const selectFile = async (): Promise<string | undefined> => {
  const options: vscode.OpenDialogOptions = {
    canSelectMany: false,
    openLabel: "Select",
    filters: {
      all_files: ["*"],
    },
  };

  const fileUri = await vscode.window.showOpenDialog(options);

  if (fileUri && fileUri.length > 0) {
    return fileUri[0].fsPath;
  }

  return undefined;
};

/**
 * Windows用の正規表現パターン
 */
const winPattern =
  /^([a-zA-Z]):\\(?:[^\\/:*?"<>|]+\\)*Users\\([^\\/:*?"<>|]+)(.*)$/;

/**
 * Mac用の正規表現パターン
 **/
const macPattern = /^\/Users\/([^/]+)(.*)$/;
/**
 * Linux用
 */
const linuxPattern = /^\/home\/([^/]+)(.*)$/;

export const removeUserName = (path: string) => {
  switch (process.platform) {
    case "win32":
      return path.replace(winPattern, "$1:\\~$2"); // Windowsの場合
    case "darwin":
      return path.replace(macPattern, "/~$2"); // Macの場合
    case "linux":
      return path.replace(linuxPattern, "/~$2"); // Linux

    default:
      return path;
  }
};
