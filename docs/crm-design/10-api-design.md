# 10. API設計書

## 方針

- REST API
- 管理APIと公開APIを分離
- 管理APIは認証必須
- 公開APIは `PUBLISHED` のみ返す
- エラー形式を統一
- 一覧APIは必ずページネーション対応

## 共通レスポンス

### 成功

```json
{
  "data": {},
  "meta": {}
}
```

### エラー

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力内容を確認してください",
    "details": {}
  }
}
```

## ステータスコード

| Code | 用途 |
|---|---|
| 200 | 成功 |
| 201 | 作成成功 |
| 204 | 削除成功 |
| 400 | 不正リクエスト |
| 401 | 未認証 |
| 403 | 権限なし |
| 404 | 見つからない |
| 409 | 競合 |
| 422 | バリデーションエラー |
| 500 | サーバーエラー |

## 管理API

### Activities

| Method | Path | 説明 |
|---|---|---|
| GET | `/api/admin/activities` | 活動一覧 |
| POST | `/api/admin/activities` | 活動作成 |
| GET | `/api/admin/activities/:id` | 活動詳細 |
| PATCH | `/api/admin/activities/:id` | 活動更新 |
| DELETE | `/api/admin/activities/:id` | 活動アーカイブ |

### CreateActivityInput

```json
{
  "title": "未来探求インタビュー",
  "slug": "future-inquiry-interview",
  "category": "INTERVIEW",
  "summary": "公開用の短い説明",
  "body": "本文",
  "activityDate": "2026-07-20",
  "location": "仙台",
  "visibility": "PUBLIC"
}
```

### Records

| Method | Path | 説明 |
|---|---|---|
| GET | `/api/admin/records` | 記録一覧 |
| POST | `/api/admin/records` | 記録作成 |
| GET | `/api/admin/records/:id` | 記録詳細 |
| PATCH | `/api/admin/records/:id` | 記録更新 |
| DELETE | `/api/admin/records/:id` | 記録アーカイブ |

### Media

| Method | Path | 説明 |
|---|---|---|
| GET | `/api/admin/media` | 素材一覧 |
| POST | `/api/admin/media` | 素材登録 |
| GET | `/api/admin/media/:id` | 素材詳細 |
| PATCH | `/api/admin/media/:id` | 素材情報更新 |
| DELETE | `/api/admin/media/:id` | 素材アーカイブ |

### Reviews

| Method | Path | 説明 |
|---|---|---|
| GET | `/api/admin/reviews` | レビュー一覧 |
| POST | `/api/admin/reviews` | レビュー依頼 |
| GET | `/api/admin/reviews/:id` | レビュー詳細 |
| POST | `/api/admin/reviews/:id/comments` | コメント追加 |
| POST | `/api/admin/reviews/:id/approve` | 承認 |
| POST | `/api/admin/reviews/:id/reject` | 差し戻し |

### Publishing

| Method | Path | 説明 |
|---|---|---|
| POST | `/api/admin/publish` | 即時公開 |
| POST | `/api/admin/publish/schedule` | 公開予約 |
| POST | `/api/admin/unpublish` | 公開停止 |

## 公開API

| Method | Path | 説明 |
|---|---|---|
| GET | `/api/public/activities` | 公開済み活動一覧 |
| GET | `/api/public/activities/:slug` | 公開済み活動詳細 |
| GET | `/api/public/records` | 公開済み記録一覧 |
| GET | `/api/public/records/:slug` | 公開済み記録詳細 |
| GET | `/api/public/site-settings` | 公開サイト設定 |

## 一覧クエリ

```text
?page=1&pageSize=20&status=DRAFT&type=REPORT&sortBy=updatedAt&sortOrder=desc
```

## ページネーションレスポンス

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 128,
    "totalPages": 7
  }
}
```

## バリデーション

- title: 1〜120文字
- slug: 半角英数字とハイフン、重複不可
- summary: 1〜240文字
- body: 記録公開時は必須
- image: 公開時は公開利用可能な素材のみ
