# emi-test

毎日ひとつのお題に答える、直感と内省のためのブラウザアプリです。

- `index.html`: 画面の構造
- `styles.css`: 見た目
- `app.js`: お題の表示・保存・深掘り質問の処理
- `history.html`: 保存済み記録の一覧画面

## 起動する

ターミナルで次を実行してください。

```sh
python3 app.py
```

Microsoft Edgeで [http://127.0.0.1:8000](http://127.0.0.1:8000) を開きます。記録はこのフォルダ内の `notes.db`（SQLiteデータベース）に保存されます。

## HTMLだけで開く場合

このアプリはSQLite保存のため、上記の起動方法を使ってください。

または、VS Codeの拡張機能「Live Server」を使って `index.html` を開くと、保存時にブラウザを自動更新できます。

## Pythonで実行

```sh
python3 hello.py
```
