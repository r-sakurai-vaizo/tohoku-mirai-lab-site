# 04. 画面一覧

## 公開サイト

| ID | 画面 | URL | 目的 |
|---|---|---|---|
| PUB-001 | トップ | `/` | 団体の思想と入口を見せる |
| PUB-002 | 団体について | `/about` | ミッション、必要性、社会的意義を説明 |
| PUB-003 | 活動 | `/activities` | 公開済み活動を一覧表示 |
| PUB-004 | 記録 | `/records` | 公開済み記事・レポートを一覧表示 |
| PUB-005 | 記録詳細 | `/records/:slug` | 記事や活動レポートの本文表示 |

## 管理画面

| ID | 画面 | URL | 目的 | 主なロール |
|---|---|---|---|---|
| ADM-001 | ログイン | `/admin/login` | 管理画面への認証 | 全員 |
| ADM-002 | ダッシュボード | `/admin` | 下書き、レビュー待ち、公開予定を把握 | 全員 |
| ADM-003 | 活動一覧 | `/admin/activities` | 活動の検索・管理 | Editor以上 |
| ADM-004 | 活動作成 | `/admin/activities/new` | 活動の新規登録 | Editor以上 |
| ADM-005 | 活動編集 | `/admin/activities/:id` | 活動内容の編集 | Editor以上 |
| ADM-006 | 記録一覧 | `/admin/records` | 記録の検索・管理 | Editor以上 |
| ADM-007 | 記録作成 | `/admin/records/new` | 記録の新規作成 | Editor以上 |
| ADM-008 | 記録編集 | `/admin/records/:id` | 本文、素材、公開設定の編集 | Editor以上 |
| ADM-009 | 素材一覧 | `/admin/media` | 画像・資料・動画サムネイル管理 | Contributor以上 |
| ADM-010 | 素材詳細 | `/admin/media/:id` | クレジット、利用範囲、紐付け確認 | Contributor以上 |
| ADM-011 | レビュー一覧 | `/admin/reviews` | レビュー依頼と差し戻し管理 | Reviewer以上 |
| ADM-012 | レビュー詳細 | `/admin/reviews/:id` | コメント、承認、差し戻し | Reviewer以上 |
| ADM-013 | 公開予定 | `/admin/publishing` | 予約公開と公開済み確認 | Editor以上 |
| ADM-014 | ユーザー管理 | `/admin/users` | メンバーと権限管理 | Admin |
| ADM-015 | サイト設定 | `/admin/settings/site` | トップ文言、注記、基本情報編集 | Admin |
| ADM-016 | 監査ログ | `/admin/audit-logs` | 操作履歴の確認 | Admin |

## MVP対象画面

初期実装で優先する画面

- ADM-001 ログイン
- ADM-002 ダッシュボード
- ADM-003 活動一覧
- ADM-004 活動作成
- ADM-005 活動編集
- ADM-006 記録一覧
- ADM-007 記録作成
- ADM-008 記録編集
- ADM-009 素材一覧
- ADM-011 レビュー一覧
- ADM-012 レビュー詳細

## 後続対象

- 記録詳細の高機能エディタ
- 公開予約カレンダー
- 関係者管理
- 外部SNS配信用文面生成
- アクセス分析
