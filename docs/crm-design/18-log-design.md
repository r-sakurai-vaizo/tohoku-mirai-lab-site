# 18. ログ設計書

## ログ種別

| 種別 | 保存先 | 用途 |
|---|---|---|
| アプリケーションログ | Platform logs | 障害調査 |
| 監査ログ | audit_logs | 誰が何をしたか追跡 |
| アクセスログ | CDN / Platform | 不正アクセス調査 |
| 公開ジョブログ | publish_jobs | 公開失敗調査 |
| 連携ログ | integration_logs | 外部連携調査 |

## 監査ログイベント

| action | 内容 |
|---|---|
| LOGIN | ログイン |
| LOGOUT | ログアウト |
| CREATE_ACTIVITY | 活動作成 |
| UPDATE_ACTIVITY | 活動更新 |
| ARCHIVE_ACTIVITY | 活動アーカイブ |
| CREATE_RECORD | 記録作成 |
| UPDATE_RECORD | 記録更新 |
| ARCHIVE_RECORD | 記録アーカイブ |
| UPLOAD_MEDIA | 素材追加 |
| UPDATE_MEDIA_SCOPE | 素材利用範囲変更 |
| REQUEST_REVIEW | レビュー依頼 |
| APPROVE_REVIEW | 承認 |
| REJECT_REVIEW | 差し戻し |
| PUBLISH_CONTENT | 公開 |
| UNPUBLISH_CONTENT | 公開停止 |
| UPDATE_ROLE | 権限変更 |

## audit_logsスキーマ

```json
{
  "id": "uuid",
  "actorId": "uuid",
  "action": "UPDATE_RECORD",
  "targetType": "record",
  "targetId": "uuid",
  "ipAddress": "203.0.113.1",
  "userAgent": "Mozilla/5.0",
  "metadata": {
    "before": {},
    "after": {},
    "reason": "表現修正"
  },
  "createdAt": "2026-07-05T00:00:00Z"
}
```

## ログに含めない情報

- パスワード
- セッションCookie
- APIキー
- 個人情報の全文
- 未公開取材メモの全文

## ログ保持期間

| ログ | 期間 |
|---|---|
| 監査ログ | 3年 |
| アプリケーションログ | 90日 |
| アクセスログ | 90日 |
| 公開ジョブログ | 1年 |
| 連携ログ | 1年 |

## 検索要件

- actor
- action
- targetType
- targetId
- date range
- IP address

## アラート対象

- 5分以内にログイン失敗10回以上
- Admin権限変更
- 公開停止
- 公開ジョブ失敗
- Storageアップロード失敗
- 500エラー増加
