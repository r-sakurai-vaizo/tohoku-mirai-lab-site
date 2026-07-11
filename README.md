# 東北大未来探求ラボ サイト

東北大未来探求ラボの公開サイトと、活動・記録を作るための初期CRMプロトタイプです

## 公開ページ

- `index.html`: トップ
- `about.html`: 団体について
- `activities.html`: 活動
- `records.html`: 記録

ヘッダーは `団体について / 活動 / 記録` の3項目に絞っています

## データ

- `data/activities.json`: 活動一覧
- `data/records.json`: 記録一覧

公開ページの一覧部分はJSONから描画します

## 管理画面

- `admin/index.html`: ローカルCRMプロトタイプ

ブラウザのlocalStorageに下書きを保存し、JSONとして書き出せます
公開環境で使う場合は、必ず認証と保存先DBを追加してください

## CRM設計

- `docs/crm-design/README.md`: リッチCRMの20設計書
- `docs/decisions/ADR-001-crm-architecture.md`: 公開サイトとCRMを分離する判断

## ローカル確認

```powershell
python -m http.server 4173
```

ブラウザで `http://localhost:4173` を開きます
