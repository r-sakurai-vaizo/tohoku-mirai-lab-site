# 15. セキュリティ設計書

## 基本方針

- CRMは認証必須
- 認可はAPIで必ず検証する
- 公開APIは公開済みデータだけ返す
- 未公開メモ、レビューコメント、関係者情報は公開APIに含めない
- 全入力をAPI境界で検証する

## 認証

- セッションはhttpOnly Cookieで管理
- CookieはSecure、SameSite=Lax以上
- ログイン試行にレート制限をかける
- 無効化ユーザーは即時セッション失効
- パスワード認証の場合はbcrypt/scrypt/argon2を使用

## 認可

- ロールベースアクセス制御
- 所有者制限をAPIで確認
- 公開、承認、権限変更はReviewer/Adminのみ
- Admin操作は監査ログ必須

## 入力検証

| 対象 | 検証 |
|---|---|
| title | 1〜120文字 |
| slug | 半角英数字とハイフン |
| summary | 1〜240文字 |
| body | 最大文字数制限、危険HTML除去 |
| upload | MIME、拡張子、サイズ、可能ならmagic bytes |

## XSS対策

- 本文HTMLを直接保存しない
- Markdownまたは構造化JSONとして保存
- 表示時にサニタイズ
- `innerHTML` へ未検証文字列を渡さない
- CSPを設定する

## CSRF対策

- SameSite Cookie
- 状態変更APIにCSRFトークン
- CORSは管理画面ドメインに限定

## ファイルアップロード

- 許可MIME: image/jpeg, image/png, image/webp, application/pdf
- 最大サイズ: 10MB
- ファイル名はサーバー側で再生成
- 公開URLは推測困難なパスにする
- EXIFの扱いを定義し、必要に応じて削除

## 機密情報

- APIキー、DBパスワード、Storageキーは環境変数
- ログにトークン、Cookie、個人情報を出さない
- 取材メモに個人情報が入る可能性を前提にアクセス制限

## セキュリティヘッダー

- Content-Security-Policy
- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

## 監査

- ログイン
- ログアウト
- 作成
- 更新
- 削除
- 承認
- 公開
- 権限変更
- 素材公開可否変更

## インシデント対応

- 公開停止ボタンを用意
- Adminが対象コンテンツを即時UNPUBLISHEDにできる
- 操作履歴から直前の状態を確認できる
- 画像権利問題が発生した場合は素材を非公開化し、紐付け先を洗い出す
