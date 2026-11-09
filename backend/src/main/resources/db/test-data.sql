-- テストデータ投入スクリプト
-- 実行前に tasks テーブルが存在することを確認してください（Spring Boot 起動後に自動生成されます）

INSERT INTO tasks (id, title, status, category, memo, created_at, display_order) VALUES
  ('a1b2c3d4-0001-0000-0000-000000000001', 'Spring Bootの学習', 'doing', '学習', 'REST APIの実装方法を学ぶ', NOW(), 1),
  ('a1b2c3d4-0001-0000-0000-000000000002', 'PostgreSQLのセットアップ', 'done', 'インフラ', 'Dockerで起動する', NOW(), 2),
  ('a1b2c3d4-0001-0000-0000-000000000003', 'タスク管理アプリのUI設計', 'todo', '設計', '画面設計書を作成する', NOW(), 3),
  ('a1b2c3d4-0001-0000-0000-000000000004', 'フロントエンド実装', 'todo', '開発', 'Reactでコンポーネントを作る', NOW(), 4),
  ('a1b2c3d4-0001-0000-0000-000000000005', 'APIテストの実施', 'todo', 'テスト', 'curlとPostmanで動作確認', NOW(), 5)
ON CONFLICT (id) DO NOTHING;
