# emi-test

毎日ひとつのお題に答える、直感と内省のためのブラウザアプリです。記録はサーバーへ送信されず、使っているブラウザ内だけに保存されます。

- `index.html`: 画面の構造
- `styles.css`: 見た目
- `app.js`: お題の表示・ブラウザ内への保存・深掘り質問の処理
- `history.html`: 保存済み記録の一覧画面

## 開く

`index.html` をブラウザで開くだけで使えます。Pythonやデータベースの設定は必要ありません。

## GitHub Pagesで公開する

GitHubのリポジトリ画面で `Settings` → `Pages` を開き、次のように設定します。

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/(root)`

保存後、表示されるURLから公開サイトを開けます。

> 記録はブラウザごと・端末ごとに別々に保存されます。ブラウザのデータを削除すると記録も消えるため、大切な内容は別途控えてください。

## Pythonで実行

```sh
python3 hello.py
```
