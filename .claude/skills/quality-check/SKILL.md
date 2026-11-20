---
name: quality-check
description: React（フロントエンド）とSpring Boot（バックエンド）の全体品質チェックを実施するスキル。「品質チェック」「lintチェック」「コードレビュー」「checkstyle」「oxlint」「ドキュメント整合」などと言われたとき、またはPRを作る前の確認として使う。
---

# 品質チェック スキル

このプロジェクト（React + Spring Boot）の品質チェックを以下の手順で実施する。

---

## ステップ1：フロントエンド チェック

### 1-1. oxlint（lintチェック）

```bash
cd frontend && npx oxlint src/ 2>&1
```

**合格基準：** 出力なし（warning・error ゼロ）

**主な検出項目と対処法：**

| 警告 | 原因 | 対処 |
|------|------|------|
| `react/purity` — Cannot call impure function during render | `new Date()` / `Math.random()` などをレンダー中に直接呼び出している | コンポーネント外の純粋関数に切り出す、または `useMemo` を使う |
| `react/set-state-in-effect` — Calling setState synchronously within an effect | `useEffect` 内で `setState` を同期呼び出ししている | 親で `key={id}` を渡して再マウント方式に変更、または同期 `useEffect` を削除 |

### 1-2. TypeScript 型チェック

```bash
cd frontend && npx tsc --noEmit 2>&1
```

**合格基準：** 出力なし（エラーゼロ）

### 1-3. コード品質の目視確認ポイント

- `api/` のbaseURLがハードコードされていないか → `import.meta.env.VITE_API_URL` を使う
- インラインスタイル（`style={{ ... }}`）がCSSクラスで代替できないか
- 未使用の import・変数がないか
- テンプレートの残骸（Viteデフォルトの `App.css` など）が残っていないか

---

## ステップ2：バックエンド チェック

### 2-1. Checkstyle

```bash
cd backend && ./mvnw checkstyle:check -q 2>&1
```

**合格基準：** 出力なし（エラーゼロ）

**主な検出項目と対処法：**

| エラー | 原因 | 対処 |
|--------|------|------|
| `AvoidStarImport` | `import jakarta.persistence.*` などワイルドカード import | 個別 import に展開する |
| `UnusedImports` | 使っていない import がある | 削除する |
| `Indentation` | インデントが4スペース基準からずれている | 統一する |
| `EmptyCatchBlock` | catch ブロックが空 | ログ出力か適切な例外処理を追加する |

### 2-2. コード品質の目視確認ポイント

- `RuntimeException` を直接 throw していないか → `ResponseStatusException(HttpStatus.NOT_FOUND, ...)` を使う
- CORS origin がハードコードされていないか → `application.yml` の `cors.allowed-origins` プロパティ参照にする
- マジックナンバー（意味のある数値リテラル）が直接使われていないか → 定数に抽出する
- Entity クラスをそのまま `@RequestBody` で受け取っていないか（DTO 分離推奨）
- `@Transactional(readOnly = true)` がクラスレベルで設定されているか

---

## ステップ3：ドキュメントと実装の整合チェック

以下のドキュメントを読み、実装と乖離していないか確認する。

| ドキュメント | 確認するパス |
|-------------|-------------|
| 要件定義書 | `要件定義書.md` |
| 機能一覧 | `docs/機能一覧.md` |
| 機能要件 | `docs/機能要件.md` |
| 画面設計 | `docs/画面設計.md` |
| DB設計 | `docs/データベース設計.md` |
| 技術スタック | `docs/技術スタック.md` |

**主な確認項目：**

- [ ] データ保存方式（localStorage / PostgreSQL）が実装と一致しているか
- [ ] 実装済みの機能がすべて機能一覧に記載されているか
- [ ] 削除・編集などの操作フローがドキュメントの記載と一致しているか
- [ ] DB テーブル定義に実装済みのカラムがすべて記載されているか（`priority`, `due_date` など）
- [ ] 画面設計にモーダル（編集・削除確認）が記載されているか

**乖離が見つかった場合：** ドキュメント側を実装に合わせて修正する。

---

## ステップ4：結果の報告

チェック完了後、以下の形式でまとめる。

```
## 品質チェック結果

### フロントエンド
- oxlint: X件 → 修正後 0件
- TypeScript: エラーなし

### バックエンド
- Checkstyle: X件 → 修正後 0件

### ドキュメント
- 乖離 X件 → 修正済み

### 修正した内容
1. ...
2. ...
```

---

## このプロジェクトの設定ファイル

| ツール | 設定ファイル |
|--------|-------------|
| oxlint | `frontend/package.json`（scripts.lint） |
| TypeScript | `frontend/tsconfig.json` |
| Checkstyle | `backend/checkstyle.xml` |
| Checkstyle プラグイン | `backend/pom.xml` |
