import * as vscode from "vscode";

/**
 * プロンプト一覧
 * 新しいプロンプトを使う場合はここに作成して適宜インポートして使ってください。
 */

/**
 * 言語
 */
const language = vscode.workspace
  .getConfiguration("auto-readme")
  .get("language") as string | undefined;

/**
 * 普通にREADME作成
 * @param filecontent
 * @param tree
 * @returns
 */
export const prompt_01 = (filecontent: string, tree: string) => {
  return `Please make README of the following source code in ${language}.\nIf possible, also create a configuration diagram in MERMAID.(mermaid is written in English)\nsource code:\n${filecontent}\n\ndirectory configuration:\n${tree}`;
};

/**
 * 既にあるREADMEを元に新しく作成
 * @param filecontent
 * @param tree
 * @param pastFileContent
 * @returns
 */
export const prompt_02 = (
  filecontent: string,
  tree: string,
  pastFileContent: string
) => {
  return `Please create a new README in ${language} using the following source code as a README reference.\nIf possible, also create a configuration diagram in MERMAID.(mermaid is written in English)\nREADME:\n${pastFileContent}\n\nsource code:\n${filecontent}\n\ndirectory configuration:\n${tree}`;
};
