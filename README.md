# AutoREADME

AutoREADME は、VSCode 上で README ファイルを自動生成することができる拡張機能です。
OpenAI という API を利用して、ソースコード、フォルダ構成などの必要な情報を取得し、Markdown 形式で README ファイルを生成します。

## 機能

この拡張機能は以下の機能を提供しています。

- README ファイルの自動生成
- OpenAI API キーの設定

## インストール

1. VSCode を開き、`"Extensions"`メニューを選択します。
2. 検索バーに`"AutoREADME"`と入力し、拡張機能を検索します。
3. 拡張機能を選択し、`"Install"`ボタンをクリックしてインストールします。
4. インストールが完了したら`"Do you want to open the Extension Name settings?"`の確認メッセージが表示されるので、`"Open Settings"`を押して設定画面へ移動して、APIキーなどを設定する
   - [APIキーの取得方法](https://platform.openai.com/account/api-keys)

## 使い方

1. フォルダを開き、`"README.md"`ファイルが存在しない場合、`"Ctrl + Shift + P"`を押してコマンドパレットを表示します。
2. `"Create README"`を選択し、`Enter` キーを押します。
3. API キーの設定がされていない場合、プロンプトが表示されます。APIキーを入力して`Enter` キーを押します。
4. `"Reset exists README？"`の確認メッセージが出ます。新しくREADMEを生成する場合は`"Yes"`、既存のREADMEを参照させる場合は`"No"`を選択してください。
5. メインのファイルを選択してください。
6. ファイルが自動生成されるまでしばらくお待ちください。

## ライセンス

MIT License. 詳細については[LICENSE.md](./LICENSE.md)を参照してください。

# AutoREADME

AutoREADME is an extension for VSCode that allows for automatic generation of README files. It uses an API called OpenAI to gather necessary information such as source code and folder structure and generates a README file in Markdown format.

## Features

This extension provides the following features:

- Automatic generation of README files
- Configuration of OpenAI API key

## Installation

1. Open VSCode and select the "Extensions" menu.
2. Type "AutoREADME" into the search bar and search for the extension.
3. Select the extension and click the "Install" button to install it.
4. After installation is complete, a confirmation message "Do you want to open the Extension Name settings?" will appear. Click "Open Settings" to go to the settings page and configure the API key.
   - [How to obtain an API key](https://platform.openai.com/account/api-keys)

## Usage

1. Open a folder and if a "README.md" file does not exist, press "Ctrl + Shift + P" to display the command palette.
2. Select "Create README" and press "Enter".
3. If an API key has not been set, a prompt will appear. Enter the API key and press "Enter".
4. A confirmation message "Reset exists README?" will appear. Choose "Yes" to generate a new README or "No" to refer to an existing README.
5. Select the main file.
6. Please wait a moment while the file is automatically generated.

## License

MIT License. See [LICENSE.md](./LICENSE.md) for more details.