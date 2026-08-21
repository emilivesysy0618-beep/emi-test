# emi-test

毎日ひとつのお題に答える、直感と内省のためのブラウザアプリです。Googleでログインすると、記録は本人だけが読めるFirebase Cloud Firestoreへ保存されます。

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

> 記録を見る・保存するにはGoogleログインが必要です。同じGoogleアカウントでログインすれば、別の端末でも同じ記録を確認できます。

## Pythonで実行

```sh
python3 hello.py
```
