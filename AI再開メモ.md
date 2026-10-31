# Claude Code セッション再開方法

## 一番手軽な方法：時計マークを押す

VSCode の Claude Code パネルにある **時計マーク（履歴ボタン）** をクリック。
過去のセッション一覧が表示されるので、再開したいものを選ぶ。

---

## ターミナルから再開する方法

```bash
/resume
```

過去のセッション一覧が表示され、選択して再開できる。

---

## 会話ログの保存場所

```
~/.claude/projects/-Users-togomizuho-Desktop-hennshuu-Raisetech-taskmanegment/
```

`.jsonl` ファイルとして保存されている。Finder で確認したい場合：
1. Finder を開く
2. `Command + Shift + G`
3. `~/.claude/projects/` と入力して移動

---

## よくある焦りポイント

**「画面からメッセージが消えた！」**
→ 消えたわけではなく、長い会話を Claude が自動圧縮しているだけ。
　時計マークから該当セッションを再開すれば文脈は引き継がれる。

---

## 一番の予防策

こまめに **git commit** しておく。
会話ログが消えてもコードが残っていれば実害なし。
