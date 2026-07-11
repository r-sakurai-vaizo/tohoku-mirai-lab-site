# 東北大未来探求ラボ CRM設計書 一覧

## 前提

- 公開サイトは静かで公式サイトらしい見せ方を維持する
- CRMは公開ナビに出さない非公開運用システムとする
- 活動、記録、画像素材、公開承認、公開サイト反映をCRMで扱う
- 初期は小規模運営だが、将来は記事数、素材数、関係者数が増える前提で設計する
- 東北大学の公式組織ではないため、公開前に表現確認と権限確認を必須にする

## 設計書

1. [要件定義書](./01-requirements.md)
2. [業務フロー図](./02-business-flow.md)
3. [システム構成図](./03-system-architecture.md)
4. [画面一覧](./04-screen-list.md)
5. [画面遷移図](./05-screen-transition.md)
6. [画面設計書](./06-screen-design.md)
7. [機能仕様書](./07-functional-spec.md)
8. [DB設計書](./08-db-design.md)
9. [ER図](./09-er-diagram.md)
10. [API設計書](./10-api-design.md)
11. [シーケンス図](./11-sequence-diagrams.md)
12. [権限設計書](./12-permission-design.md)
13. [状態遷移図](./13-state-transition.md)
14. [非機能要件定義書](./14-non-functional-requirements.md)
15. [セキュリティ設計書](./15-security-design.md)
16. [インフラ設計書](./16-infrastructure-design.md)
17. [外部連携設計書](./17-external-integration.md)
18. [ログ設計書](./18-log-design.md)
19. [テスト設計書](./19-test-design.md)
20. [運用設計書](./20-operations-design.md)

## 推奨アーキテクチャ

- 公開サイト: 既存静的サイトを維持し、公開済みJSONまたはAPIから活動・記録を取得
- CRM: Next.js App Router想定の認証付き管理画面
- DB: PostgreSQL
- Storage: 画像・動画サムネイル・添付ファイル用オブジェクトストレージ
- 公開反映: `published` データのみ公開APIまたは静的JSONへ同期

## Devil's Advocateレビュー要約

### Critical

- CRMを認証なしで公開運用してはいけない
- 公開承認なしに記事が出る設計は、大学公式誤認や関係者トラブルにつながる
- 画像・取材メモ・関係者情報は個人情報や未公開情報を含むため、公開データと内部データをDB上で分離する

### Warning

- いきなり高機能CMSを作ると公開サイト改善より運用画面の実装が重くなる
- 活動と記録の概念が曖昧なままだと、記事、イベント、プロジェクトが混ざって検索不能になる
- ロールを増やしすぎると小規模運営では管理負荷が上がる

### 採用方針

初期版は、活動・記録・素材・公開承認・公開同期に絞る
将来版で、取材管理、関係者管理、レビューコメント、外部配信、分析を追加する
