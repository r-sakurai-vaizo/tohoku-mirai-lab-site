# 13. 状態遷移図

## コンテンツ状態

```mermaid
stateDiagram-v2
  [*] --> DRAFT
  DRAFT --> REVIEW_REQUESTED: レビュー依頼
  REVIEW_REQUESTED --> NEEDS_REVISION: 差し戻し
  NEEDS_REVISION --> DRAFT: 修正
  REVIEW_REQUESTED --> APPROVED: 承認
  APPROVED --> SCHEDULED: 公開予約
  APPROVED --> PUBLISHED: 即時公開
  SCHEDULED --> PUBLISHED: 予約時刻到達
  PUBLISHED --> REVISING: 改訂作成
  REVISING --> REVIEW_REQUESTED: 再レビュー依頼
  PUBLISHED --> UNPUBLISHED: 公開停止
  DRAFT --> ARCHIVED: アーカイブ
  NEEDS_REVISION --> ARCHIVED: アーカイブ
  UNPUBLISHED --> ARCHIVED: アーカイブ
```

## 状態一覧

| 状態 | 説明 | 公開API |
|---|---|---|
| DRAFT | 下書き | 出ない |
| REVIEW_REQUESTED | レビュー依頼中 | 出ない |
| NEEDS_REVISION | 差し戻し | 出ない |
| APPROVED | 承認済み | 出ない |
| SCHEDULED | 公開予約 | 予約時刻まで出ない |
| PUBLISHED | 公開済み | 出る |
| REVISING | 改訂中 | 現公開版のみ出る |
| UNPUBLISHED | 公開停止 | 出ない |
| ARCHIVED | アーカイブ | 出ない |

## レビュー状態

```mermaid
stateDiagram-v2
  [*] --> REQUESTED
  REQUESTED --> COMMENTED: コメント
  COMMENTED --> REQUESTED: 修正確認
  REQUESTED --> APPROVED: 承認
  REQUESTED --> REJECTED: 差し戻し
  REJECTED --> REQUESTED: 再依頼
  APPROVED --> [*]
```

## 素材状態

```mermaid
stateDiagram-v2
  [*] --> UPLOADED
  UPLOADED --> METADATA_REQUIRED: クレジット不足
  METADATA_REQUIRED --> INTERNAL_ONLY: 公開不可
  METADATA_REQUIRED --> PUBLIC_ALLOWED: 公開可
  PUBLIC_ALLOWED --> ARCHIVED: アーカイブ
  INTERNAL_ONLY --> ARCHIVED: アーカイブ
```

## 遷移制約

- `PUBLISHED` へ遷移できるのはReviewer以上
- `PUBLISHED` の本文直接更新は禁止
- 公開済み修正は改訂版を作って再承認する
- `ARCHIVED` から復元する場合はAdminのみ
