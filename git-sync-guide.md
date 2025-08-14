# Git同期手順書：リモートのマージ済み変更をローカルに反映

## 問題の状況
- リモートリポジトリでマージが完了しているのに、ローカルでは古い状態のまま
- mainブランチに他の人がpushしたファイルがある
- ローカルとリモートの状態を同期したい

## 解決手順

### 1. 現在の状況確認
```bash
# 現在のブランチとステータス確認
git status

# リモートリポジトリの確認
git remote -v

# 最新の変更を取得
git fetch --all

# コミット履歴の確認
git log --oneline --graph --all -20
```

### 2. ベースリポジトリ（upstream）の追加
```bash
# ベースリポジトリをupstreamとして追加
git remote add upstream https://github.com/ritika-kapoor/Hackathon-2025.git

# upstreamから最新の変更を取得
git fetch upstream
```

### 3. mainブランチの更新
```bash
# mainブランチに切り替え
git checkout main

# upstream/mainの最新状態にリセット
git reset --hard upstream/main

# リモートに強制プッシュ（注意：既存の履歴が上書きされます）
git push origin main --force
```

### 4. developブランチの更新
```bash
# developブランチに切り替え
git checkout develop

# upstream/developの最新状態にリセット
git reset --hard upstream/develop

# リモートに強制プッシュ
git push origin develop --force
```

### 5. 確認
```bash
# 現在のブランチの状態確認
git log --oneline -10

# リモートとの同期確認
git status
```

## 注意事項

### ⚠️ 強制プッシュについて
- `--force`オプションを使用すると、既存の履歴が上書きされます
- チーム開発では事前にチームメンバーに通知してください
- 個人の作業ブランチは事前にバックアップを取ってください

### 🔄 今後の運用
```bash
# 定期的にベースリポジトリの最新状態を確認
git fetch upstream

# 必要に応じて同期
git checkout main
git reset --hard upstream/main
git push origin main --force

git checkout develop
git reset --hard upstream/develop
git push origin develop --force
```

## トラブルシューティング

### 問題：backendディレクトリが未追跡状態
```bash
# backendディレクトリ内の.gitディレクトリを削除
rm -rf backend/.git

# 再度追加
git add backend/
```

### 問題：マージコンフリクトが発生
```bash
# コンフリクトを解決後
git add .
git commit -m "resolve merge conflicts"
```

## 完了確認
- ✅ mainブランチがベースリポジトリと同期済み
- ✅ developブランチがベースリポジトリと同期済み
- ✅ ローカルとリモートが完全に同期済み
- ✅ マージされた変更がすべて反映済み

---

**作成日**: 2025年1月
**対象プロジェクト**: Hackathon-2025
**ベースリポジトリ**: ritika-kapoor/Hackathon-2025
**フォークリポジトリ**: manatomato/Hackathon-2025 