# Create-Readme-OpenAI

Create-Readme-OpenAI は、VSCode 上で README ファイルを自動生成することができる拡張機能です。
OpenAI という API を利用して、説明文、使用例などの必要な情報を取得し、Markdown 形式で README ファイルを生成します。

## 機能

この拡張機能は以下の機能を提供しています。

- README ファイルの自動生成
- OpenAI API キーの設定
- ステータスバーによる OpenAI API の接続確認

## インストール

1. VSCode を開き、"Extensions"メニューを選択します。
2. 検索バーに"Create-Readme-OpenAI"と入力し、拡張機能を検索します。
3. 拡張機能を選択し、"Install"ボタンをクリックしてインストールします。

## 使い方

1. フォルダを開き、"README.md"ファイルが存在しない場合、"Ctrl + Shift + P"を押してコマンドパレットを表示します。
2. "Create README with OpenAI"を選択し、Enter キーを押します。
3. API キーの設定がされていない場合、プロンプトが表示されます。"Set API Key"を選択して、API キーを設定してください。
4. ファイルが自動生成されるまでしばらくお待ちください。

## ファイル構成

```
.
└── src
    ├── commands
    │   ├── create-readme.ts
    │   ├── set-api-key.ts
    │   └── statusBarItem.ts
    ├── extension.ts
    ├── test
    │   ├── runTest.ts
    │   └── suite
    │       ├── extension.test.ts
    │       └── index.ts
    └── utils
        ├── utils.ts
        └── openai-config.ts
```

- `commands`: コマンドを定義するフォルダ
- `extension.ts`: 拡張機能のエントリポイントとなるファイル
- `test`: テストコードを配置するフォルダ
- `utils`: 汎用的な関数を定義するフォルダ

## ライセンス

MIT License. 詳細については[LICENSE.md](./LICENSE.md)を参照してください。

# Create-Readme-OpenAI

Create-Readme-OpenAI is an extension for VSCode that can automatically generate a README file. It uses an API called OpenAI to obtain necessary information such as descriptions and usage examples, and generates the README file in Markdown format.

## Features

This extension provides the following features:

- Automatic generation of README files
- Setting of OpenAI API key
- Connection confirmation of OpenAI API through the status bar

## Installation

1. Open VSCode and select the "Extensions" menu.
2. Type "Create-Readme-OpenAI" in the search bar and search for the extension.
3. Select the extension and click the "Install" button.

## Usage

1. Open a folder and if there is no "README.md" file, press "Ctrl + Shift + P" to display the command palette.
2. Select "Create README with OpenAI" and press Enter.
3. If the API key is not set, a prompt will appear. Select "Set API Key" and set the API key.
4. Please wait a moment until the file is automatically generated.

## File structure

```
.
└── src
    ├── commands
    │   ├── create-readme.ts
    │   ├── set-api-key.ts
    │   └── statusBarItem.ts
    ├── extension.ts
    ├── test
    │   ├── runTest.ts
    │   └── suite
    │       ├── extension.test.ts
    │       └── index.ts
    └── utils
        ├── utils.ts
        └── openai-config.ts
```

- `commands`: folder that defines commands
- `extension.ts`: entry point file for the extension
- `test`: folder to place test code
- `utils`: folder that defines general-purpose functions

## License

MIT License. For more details, please refer to [LICENSE.md](./LICENSE.md).
