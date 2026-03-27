# 坑

## ignorecase

git config core.ignorecase 默认为 true

更改大小写后 Game -> game

git 本地仓库没变化。

然后设置 git config core.ignorecase false

本地仓库多出 game 

然后 push 

远程仓库会有 Game 和 game 两个文件夹

### 一、问题原因
1. **默认行为**：`core.ignorecase=true`（Windows/macOS 自动设为 `true`），Git 不识别纯大小写修改。
2. **操作失误**：直接改文件夹名 → Git 没检测到变化；再设 `core.ignorecase=false` → Git 把 `game` 当成新目录，`push` 后远程同时存在 `Game` 和 `game`。
3. **系统冲突**：Windows/macOS 不区分大小写，本地只能看到一个目录，无法操作远程的另一个。

---

### 二、修复方案（按推荐顺序）

#### 方案 A：在 Linux/WSL 环境修复（最稳妥）
在区分大小写的系统里操作，能同时看到两个目录，直接删除重复项。
```bash
# 1. 克隆仓库（或在 WSL 进入项目）
git clone https://你的仓库地址.git
cd 项目目录

# 2. 确认两个目录都存在
ls -la | grep -i game

# 3. 删除错误的目录（假设保留 game，删除 Game）
git rm -r Game/
git commit -m "Remove duplicate Game directory"
git push origin main

# 4. 本地同步（Windows/macOS）
git pull
```

#### 方案 B：本地强制清理（Windows/macOS 直接操作）
用 `--cached` 只删 Git 索引，保留本地文件。
```bash
# 1. 确保本地只有正确的 game 目录
# 2. 从 Git 索引中删除旧的 Game（不删本地文件）
git rm -r --cached Game/

# 3. 提交并推送
git add .
git commit -m "Remove duplicate Game directory from index"
git push origin main

# 4. 拉取确认
git pull
```

#### 方案 C：两步重命名法（预防+修复）
以后改大小写用这个方法，避免重复。
```bash
# 先临时改名，再改回目标名
git mv Game Game_Temp
git mv Game_Temp game

git commit -m "Rename Game to game (case-sensitive)"
git push origin main
```

---

### 三、长期预防（必做）
统一项目大小写敏感配置，避免团队再踩坑。
```bash
# 项目级（推荐）
git config core.ignorecase false

# 全局（谨慎，影响所有仓库）
git config --global core.ignorecase false

# 验证
git config core.ignorecase
# 应返回 false
```

在项目根目录添加 .gitattributes，强制大小写敏感：
plaintext
* text=auto



### 四、如果远程还是删不掉（强制清理）
```bash
# 1. 本地清理索引
git rm -r --cached Game/
git add game/
git commit -m "Clean up duplicate directories"

# 2. 强制推送（仅单人开发或确认无冲突时用）
git push --force origin main
```

---

### 五、操作后验证
```bash
# 本地
ls -la  # 只看到 game
git status  # 无未提交变化

# 远程（GitHub/GitLab）
刷新仓库页面 → 只显示 game 目录
```


