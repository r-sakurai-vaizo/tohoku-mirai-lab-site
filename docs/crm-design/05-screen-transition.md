# 05. 画面遷移図

## 公開サイト

```mermaid
flowchart LR
  Top[トップ] --> About[団体について]
  Top --> Activities[活動]
  Top --> Records[記録]
  Activities --> RecordDetail[記録詳細]
  Records --> RecordDetail
  RecordDetail --> Records
```

## 管理画面

```mermaid
flowchart TD
  Login[ログイン] --> Dashboard[ダッシュボード]

  Dashboard --> ActivityList[活動一覧]
  ActivityList --> ActivityNew[活動作成]
  ActivityList --> ActivityEdit[活動編集]
  ActivityEdit --> ReviewRequest[レビュー依頼]

  Dashboard --> RecordList[記録一覧]
  RecordList --> RecordNew[記録作成]
  RecordList --> RecordEdit[記録編集]
  RecordEdit --> ReviewRequest

  Dashboard --> MediaList[素材一覧]
  MediaList --> MediaDetail[素材詳細]

  Dashboard --> ReviewList[レビュー一覧]
  ReviewList --> ReviewDetail[レビュー詳細]
  ReviewDetail --> Publish[公開予定]
  ReviewDetail --> ActivityEdit
  ReviewDetail --> RecordEdit

  Dashboard --> Users[ユーザー管理]
  Dashboard --> Settings[サイト設定]
  Dashboard --> Audit[監査ログ]
```

## 主要導線

### 記録を公開する導線

```mermaid
sequenceDiagram
  actor Editor as 編集担当
  participant CRM as CRM
  participant Reviewer as レビュー担当
  participant Site as 公開サイト

  Editor->>CRM: 記録を作成
  Editor->>CRM: 素材を紐付け
  Editor->>CRM: レビュー依頼
  Reviewer->>CRM: 内容確認
  Reviewer->>CRM: 承認
  CRM->>Site: 公開済みデータを反映
```

## 遷移制約

- 未ログイン時に `/admin/*` へアクセスした場合は `/admin/login` へ遷移
- Contributorはレビュー承認画面へ入れない
- Reviewerはユーザー管理へ入れない
- Published状態の記事は直接編集せず、改訂版を作成して再承認する
- 公開サイトから管理画面へのリンクは出さない
