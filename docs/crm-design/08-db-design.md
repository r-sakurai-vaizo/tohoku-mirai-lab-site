# 08. DB設計書

## 方針

- PostgreSQLを前提とする
- 公開データと内部データを論理的に分ける
- `status = PUBLISHED` のみ公開APIが返す
- 全主要テーブルに `created_at`, `updated_at`, `created_by`, `updated_by` を持たせる
- 削除は原則soft delete

## テーブル一覧

| テーブル | 用途 |
|---|---|
| users | CRMユーザー |
| roles | 権限ロール |
| user_roles | ユーザーとロールの対応 |
| activities | 活動 |
| records | 記録 |
| media_assets | 素材 |
| activity_records | 活動と記録の関連 |
| content_media | 活動・記録と素材の関連 |
| reviews | レビュー依頼 |
| review_comments | レビューコメント |
| publish_jobs | 公開予約・公開実行 |
| site_settings | サイト設定 |
| audit_logs | 監査ログ |

## users

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | uuid | PK | ユーザーID |
| email | text | unique not null | メール |
| name | text | not null | 表示名 |
| status | text | not null | ACTIVE, INVITED, DISABLED |
| last_login_at | timestamptz | nullable | 最終ログイン |
| created_at | timestamptz | not null | 作成日時 |
| updated_at | timestamptz | not null | 更新日時 |

## activities

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | uuid | PK | 活動ID |
| slug | text | unique not null | URL識別子 |
| title | text | not null | タイトル |
| category | text | not null | 取材、問いの実践、社会課題PJ、記録化 |
| summary | text | not null | 概要 |
| body | text | nullable | 本文・説明 |
| internal_note | text | nullable | 内部メモ |
| activity_date | date | nullable | 活動日 |
| location | text | nullable | 場所 |
| status | text | not null | 状態 |
| visibility | text | not null | PUBLIC, INTERNAL |
| owner_id | uuid | FK users.id | 主担当 |
| published_at | timestamptz | nullable | 公開日時 |
| archived_at | timestamptz | nullable | アーカイブ日時 |
| created_at | timestamptz | not null | 作成日時 |
| updated_at | timestamptz | not null | 更新日時 |

## records

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | uuid | PK | 記録ID |
| slug | text | unique not null | URL識別子 |
| title | text | not null | タイトル |
| type | text | not null | 記事、活動レポート、ショート動画、制作メモ |
| summary | text | not null | 概要 |
| body | text | not null | 本文 |
| seo_title | text | nullable | SEOタイトル |
| meta_description | text | nullable | メタ説明 |
| status | text | not null | 状態 |
| visibility | text | not null | PUBLIC, INTERNAL |
| owner_id | uuid | FK users.id | 主担当 |
| published_at | timestamptz | nullable | 公開日時 |
| archived_at | timestamptz | nullable | アーカイブ日時 |
| created_at | timestamptz | not null | 作成日時 |
| updated_at | timestamptz | not null | 更新日時 |

## media_assets

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | uuid | PK | 素材ID |
| file_url | text | not null | 保存先URL |
| file_name | text | not null | ファイル名 |
| mime_type | text | not null | MIME |
| size_bytes | bigint | not null | サイズ |
| alt_text | text | nullable | 代替テキスト |
| credit | text | nullable | クレジット |
| license | text | nullable | ライセンス |
| usage_scope | text | not null | INTERNAL, PUBLIC_ALLOWED, PUBLIC_RESTRICTED |
| uploaded_by | uuid | FK users.id | アップロード者 |
| created_at | timestamptz | not null | 作成日時 |

## reviews

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | uuid | PK | レビューID |
| target_type | text | not null | ACTIVITY, RECORD |
| target_id | uuid | not null | 対象ID |
| requested_by | uuid | FK users.id | 依頼者 |
| reviewer_id | uuid | FK users.id | レビュー担当 |
| status | text | not null | REQUESTED, APPROVED, REJECTED |
| checklist | jsonb | not null default '{}' | チェック結果 |
| created_at | timestamptz | not null | 作成日時 |
| resolved_at | timestamptz | nullable | 完了日時 |

## audit_logs

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | uuid | PK | ログID |
| actor_id | uuid | FK users.id | 操作者 |
| action | text | not null | 操作 |
| target_type | text | not null | 対象種別 |
| target_id | uuid | nullable | 対象ID |
| ip_address | inet | nullable | IP |
| user_agent | text | nullable | UA |
| metadata | jsonb | not null default '{}' | 追加情報 |
| created_at | timestamptz | not null | 作成日時 |

## インデックス

- `activities(status, published_at desc)`
- `records(status, published_at desc)`
- `records(type, status)`
- `media_assets(usage_scope)`
- `reviews(status, reviewer_id)`
- `audit_logs(actor_id, created_at desc)`
- `audit_logs(target_type, target_id)`

## データ保持

| データ | 保持期間 |
|---|---|
| 公開記事 | 原則永続 |
| 下書き | 2年 |
| 監査ログ | 3年 |
| 無効化ユーザー | 3年 |
| 未使用素材 | 1年後に棚卸し |
