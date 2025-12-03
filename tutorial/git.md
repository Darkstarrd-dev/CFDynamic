# Git 总结

# 0. 环境与前置知识

## 0.1 常用环境

- 操作系统：Windows
- Shell：PowerShell
- 编辑器：Zed
- Git：命令行版（配合 PowerShell 使用）

---

# 1. Git 基本配置与编辑器设置

## 1.1 初始 Git 配置（建议）

```powershell
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

含义：
- `--global` 作用于当前用户所有仓库
- 每个提交都会带上这些信息

## 1.2 设置 Git 使用 Zed 作为默认编辑器

### 1.2.1 配置方式

在 PowerShell 中执行：

```powershell
git config --global core.editor "zed --wait"
```

说明：

- `core.editor`：Git 需要打开编辑器（例如写 commit message、merge 时编辑说明等）时调用的程序
- `zed --wait`：
  - `zed`：Zed 编辑器可执行命令
  - `--wait`：让 Git 等待 Zed 窗口关闭后再继续执行（否则 Git 会以为你立刻写完了）

> 注意：确保 Zed 的命令行可执行程序已在 PATH 中，如有问题可按 Zed 官方文档配置。

### 1.2.2 使用场景

- `git commit`（不加 `-m` 参数时）
- `git rebase` 过程中编辑提交信息
- 某些交互式命令（如 `git rebase -i`）等

---

# 2. 在 PowerShell 使用 echo/重定向时的编码问题

你曾遇到过：PowerShell 中用 `echo "xxx" >> file` 写出的文件不是 UTF-8，Zed 打开乱码或识别有问题。

# 3. Git 基础操作顺序示例（创建、修改、提交）

以下是一个典型的「从无到有」流程：

## 3.1 初始化仓库

在项目目录中：

```powershell
git init
```

效果：在当前目录创建 `.git` 目录，开始版本控制。

## 3.2 查看状态

```powershell
git status
```

用途：
- 查看哪些文件未跟踪（untracked）、已修改（modified）、已暂存（staged）
- 冲突、rebase/merge 状态等也会显示在这里

## 3.3 添加新文件并提交

### 3.3.1 新建或修改文件（用 Zed）

例如：

- 创建 `hello.txt`
- 输入内容：

  ```text
  Welcome to git world!
  ```

保存后，在 PowerShell 中：

```powershell
git status
```

会看到 `hello.txt` 是 untracked file。

### 3.3.2 将修改加入暂存区（stage）

```powershell
git add hello.txt
```

### 3.3.3 提交

有两种方式：

**方式 A：直接带消息**

```powershell
git commit -m "feat: add hello.txt"
```

**方式 B：使用编辑器（Zed）填写消息**

```powershell
git commit
```

Git 会打开 Zed：

- 在 Zed 中输入提交说明，如：

  ```text
  feat: add hello.txt
  ```

- 保存并关闭 Zed 的该文件
- 回到 PowerShell，Git 完成本次提交

---

# 4. Git 分支与合并（merge）

## 4.1 查看现有分支

```powershell
git branch
```

输出示例：

```text
* main
  conflict-feature
  conflict-main
  feature/conflict-test
```

- `*` 表示当前所在分支

## 4.2 创建与切换分支

### 4.2.1 创建并切换到新分支

```powershell
git checkout -b conflict-feature
```

等价于：

```powershell
git branch conflict-feature
git checkout conflict-feature
```

## 4.3 在不同分支上修改同一文件

示例流程（制造冲突前置条件）：

1. 在 `main` 分支上：

   ```powershell
   git checkout main
   ```

   修改 `hello.txt` 为：

   ```text
   Welcome to git world from MAIN side!
   ```

   然后：

   ```powershell
   git add hello.txt
   git commit -m "main: change hello.txt from main side"
   ```

2. 在 `conflict-feature` 分支上：

   ```powershell
   git checkout conflict-feature
   ```

   修改 `hello.txt` 为：

   ```text
   Welcome to git world from FEATURE side!
   ```

   然后：

   ```powershell
   git add hello.txt
   git commit -m "feature: change hello.txt from feature side"
   ```

现在两个分支在同一行上有不同修改，为后续 `merge` 冲突打下基础。

## 4.4 合并分支并解决冲突

### 4.4.1 从目标分支执行 merge

一般从主干/main 分支执行：

```powershell
git checkout main
git merge conflict-feature
```

如果出现冲突，Git 会提示：

- 某些文件有冲突，如 `hello.txt`
- `git status` 会显示状态为 `both modified`

### 4.4.2 冲突标记的形式

在有冲突的文件中类似：

```text
<<<<<<< HEAD
Welcome to git world from MAIN side!
=======
Welcome to git world from FEATURE side!
>>>>>>> conflict-feature
```

含义：

- `<<<<<<< HEAD`：当前分支（如 main）中的版本
- `=======`：分隔线
- `>>>>>>> conflict-feature`：被合并进来的分支中的版本

### 4.4.3 解决冲突的步骤

1. **打开冲突文件**（例如用 Zed）
2. 手动决定最终内容，例如：
   - 仅保留 main：

     ```text
     Welcome to git world from MAIN side!
     ```

   - 或仅保留 feature：

     ```text
     Welcome to git world from FEATURE side!
     ```

   - 或人工合并内容：

     ```text
     Welcome to git world from MAIN and FEATURE side!
     ```

3. **删除所有** `<<<<<<<` / `=======` / `>>>>>>>` 这些标记行
4. 保存文件

### 4.4.4 标记冲突已解决并提交合并

```powershell
git add hello.txt
git commit
```

- 这次 `git commit` 会创建一个 **merge commit**
- 打开 Zed 填写合并说明，保存并关闭即可

---

# 5. 清理错误提交中的冲突标记

你曾经出现过一种情况：
**冲突标记(`<<<<<<<`, `=======`, `>>>>>>>`)已经被错误地提交了，但 `git status` 显示 working tree clean。**

处理方案：

1. 再次编辑有问题的文件（如 `hello.txt`），删除冲突标记，保留想要的最终文本
2. 提交一个「修正提交」：

   ```powershell
   git add hello.txt
   git commit
   ```

   在 Zed 中填写信息，例如：

   ```text
   fix: clean up conflict markers in hello.txt
   ```

   保存并关闭，完成修正。

---

# 6. 使用 `git diff` 检查修改

## 6.1 查看工作区未暂存的修改

1. 修改某文件，例如在 `hello.txt` 末尾追加：

   ```text
   Have fun learning Git!
   ```

2. 在 PowerShell 中执行：

   ```powershell
   git diff
   ```

   你会看到类似：

   ```diff
   +Have fun learning Git!
   ```

   含义：当前工作区相对于「最近一次提交」的差异。

## 6.2 查看暂存区与上一次提交的差异

1. 将修改加入暂存区：

   ```powershell
   git add hello.txt
   ```

2. 查看暂存区与 HEAD 的差异：

   ```powershell
   git diff --cached
   # 或
   git diff --staged
   ```

用法要点：

- `git diff`：工作区 vs 暂存区
- `git diff --cached` / `--staged`：暂存区 vs 最近一次提交

推荐日常流程：

```powershell
git status
git diff
git diff --cached
```

---

# 7. 理解提交历史与分支结构 (`log`, `HEAD`)

## 7.1 使用图形化 log 查看分支结构

常用命令：

```powershell
git log --oneline --graph --decorate --all -10
```

参数含义：

- `--oneline`：一行显示一个提交
- `--graph`：左边用简单 ASCII 图画出分支结构
- `--decorate`：显示分支名、标签名等指示
- `--all`：展示所有分支的历史
- `-10`：显示最近 10 条提交（可按需调整）

观察点：

- 当前分支（HEAD）指向的位置
- 各分支（如 `main`, `conflict-feature`, `conflict-main`）所在的 commit
- merge 提交通常会有两个父节点，图形上会显示合并线

## 7.2 理解 `HEAD` 与父提交（`^` / `~`）

在 PowerShell 中：

```powershell
git rev-parse HEAD
git rev-parse HEAD^
git rev-parse HEAD~2
```

- `HEAD`：当前所在提交对象
- `HEAD^`：当前提交的父提交（对普通提交来说就是上一个提交）
- `HEAD~2`：向上走两次父关系，相当于 `HEAD^^`

这对理解：

- `git reset`
- `git rebase`
- 回退到某个历史节点

等操作非常重要。

---

# 8. 使用 `rebase` 体验线性历史与冲突

你已经体验过 merge 冲突，这里补充 `rebase` 的使用逻辑（实际步骤与指令）。

> 推荐在已有的 `main` + `conflict-feature` 分支基础上操作。

## 8.1 在 main 上再做一次修改（制造 rebase 冲突条件）

```powershell
git checkout main
```

修改 `hello.txt` 为：

```text
Welcome to git world from MAIN rebase test!
```

提交：

```powershell
git add hello.txt
git commit -m "main: rebase test change welcome line"
```

## 8.2 切换到 feature 分支

```powershell
git checkout conflict-feature
```

此时两条分支历史已经进一步分叉。

## 8.3 以 main 为基底进行 rebase

```powershell
git rebase main
```

- Git 会尝试把 `conflict-feature` 上的提交「平移」到 `main` 最新提交之后
- 若同一行有不同修改，会产生 **rebase 冲突**

## 8.4 解决 rebase 冲突

遇到冲突时，Git 提示类似：

```text
CONFLICT (content): Merge conflict in hello.txt
```

处理步骤与 merge 冲突相似：

1. 打开 `hello.txt`，查看冲突标记：

   ```text
   <<<<<<< HEAD
   （main 分支内容）
   =======
   （feature 分支内容）
   >>>>>>> （某个 commit）
   ```

2. 手动编辑为期望版本，删除所有标记行
3. 标记该文件冲突已解决：

   ```powershell
   git add hello.txt
   ```

4. 继续 rebase 流程：

   ```powershell
   git rebase --continue
   ```

若再有冲突，重复上述流程，直到 rebase 完成。

## 8.5 merge 与 rebase 的对比（概念）

- `merge`：
  - 产生一个新的 **merge commit**（有两个父提交）
  - 完整保留分支分叉和合并的历史
- `rebase`：
  - 不产生额外的 merge commit（除非你用了 `--rebase-merges` 之类）
  - 将 feature 分支的提交「搬运」到目标分支后方
  - 得到**更线性**的提交历史

实战建议：

- 公共分支（如共享的 `main`）：一般使用 merge，避免强行改写别人已经拉取的历史
- 自己本地还未推送的 feature 分支：可以自由使用 rebase，让历史更干净

---

# 9. 远程仓库（GitHub）操作顺序预览

虽然我们尚未详做，但已有相关说明，这里按顺序整理便于之后查阅。

## 9.1 添加远程仓库 `origin`

在 GitHub 创建一个空仓库（不要勾选 Initialize with README），得到地址，例如：

- SSH：`git@github.com:yourname/your-repo.git`
- HTTPS：`https://github.com/yourname/your-repo.git`

在本地仓库中执行：

```powershell
git remote add origin git@github.com:yourname/your-repo.git
# 或
git remote add origin https://github.com/yourname/your-repo.git
```

## 9.2 推送本地分支到远程

从当前分支（比如 `conflict-main`）推送：

```powershell
git push -u origin conflict-main
```

说明：

- `-u` = `--set-upstream`：为当前本地分支设置「默认远程跟踪分支」，之后可直接 `git push` / `git pull`
- `origin`：远程仓库的别名
- `conflict-main`：分支名

## 9.3 常见协作流程（概述）

1. 从 `main` 创建新分支：

   ```powershell
   git checkout main
   git pull origin main  # 同步远程最新 main
   git checkout -b feature/xxx
   ```

2. 开发 → `git add` → `git commit`
3. 推送到远程：

   ```powershell
   git push -u origin feature/xxx
   ```

4. 在 GitHub 上发起 Pull Request
5. 处理冲突（可能用 merge 或 rebase）
6. 本地同步最新 main：

   ```powershell
   git checkout main
   git pull
   ```

---

# 10. 推荐的日常命令组合（备查）

在任何时候，遇到「不确定当前状态」时，建议这一套：

```powershell
git status
git log --oneline --graph --decorate --all -10
git diff
git diff --cached
```

基本就能回答：

- 我现在在哪个分支？
- 最近的提交历史和分支结构是什么？
- 当前有哪些改动还没暂存？
- 暂存区现在准备提交哪些改动？

---

下面是把「如何从某个提交点回滚 / 新开分支」整合进你原始 `git.md` 的一个新章节草稿。你可以直接把这一节追加到原笔记末尾，或按需要调整编号。

---

# 11. 从某个提交点回退与重新起步（回滚、开新分支）

在你现在的工作流中：

- 每次和 AI 完成一个「小模块」就做一次提交，并推送保存
- 过一段时间可能发现：某个阶段开始的设计方向是错的，希望「回到早期一个稳定点重新来」

例如时间线：

```text
1（正确，push） -> 2（正确，push） -> 3（正确，push） -> 4（错误，push）
```

后来你发现「从 4 开始方向不对，甚至 3 开始就不满意」，想要：

- 回到 2 的代码状态
- 从 2 再开始一条新的提交线：

```text
2 -> 3'（正确，push） -> 4'（正确，push）
           ↑
原来的 3、4 先保留，以免信息丢失
```

本节重点讲：

1. **推荐方案：在旧历史上“开新分支”，不破坏已有提交**
2. 对比：真的让当前分支「退回到 2」的做法（`reset` / `revert`）
3. 在 **命令行** 和 **Zed 编辑器 Git 面板 + 终端** 里的具体操作

---

## 11.1 推荐方案：从某个提交「新建分支」继续开发

这是一种 **不破坏现有历史** 的方式，非常适合你现在的「模块化 + 逐步 push + 可能回滚」的工作流。

### 11.1.1 场景与目标

假设当前分支 `main` 的历史为：

```text
1 -- 2 -- 3 -- 4 (HEAD -> main)
```

你想：

- 保留 `3`、`4` 这条线（方便以后审查 / 对比）
- **从 2 新开一条支线**，在其上继续 3'、4'

图示为：

```text
        3 -- 4   (main)
       /
1 -- 2
       \
        3' -- 4' (from-2)
```

### 11.1.2 命令行操作

1. **查看提交历史，找到“2”的 commit ID**

   ```powershell
   git log --oneline --graph --decorate --all
   ```

   举例输出：

   ```text
   e4f5g6h4 (HEAD -> main) 4: something wrong
   d3e4f5g3 3: some feature
   a2b3c4d2 2: stable base
   ...
   ```

   记住「2」那一行前面的哈希值，比如：`a2b3c4d2`（前几位即可）。

2. **基于 2 新建分支并切换过去**

   ```powershell
   # 一步到位：从 2 建分支并切换到该分支
   git checkout -b from-2 a2b3c4d2
   ```

   现在：

   - `HEAD` 指向 `from-2`
   - 工作区文件内容就是「提交 2 时」的状态

3. **在新分支上继续开发**

   - 编辑文件、`git add`、`git commit -m "3': something better"` …
   - 完成一阶段后推送到远程：

     ```powershell
     git push -u origin from-2
     ```

   此后在 `from-2` 上只需：

   ```powershell
   git push
   ```

### 11.1.3 在 Zed 里的具体步骤

由于 Zed 的 Git 面板目前主要处理「暂存 / 提交 / 推送」，**创建基于某个历史点的新分支** 仍然推荐在 Zed 的终端里完成，配合面板查看效果。

1. **在 Zed 终端查看历史**

   - 打开 Zed 内置终端（View → Terminal）
   - 运行：

     ```powershell
     git log --oneline --graph --decorate --all
     ```

   - 从输出中找到你想回到的「2」的那一行，复制前几位哈希，例如 `a2b3c4d2`

2. **在终端中新建分支并切换**

   ```powershell
   git checkout -b from-2 a2b3c4d2
   ```

3. **确认当前分支**

   - Zed 状态栏 / Git 面板顶部应该显示：`… / from-2`
   - 打开文件，内容应与提交 2 时一致

4. **之后开发的日常流程就完全用 Zed 面板即可：**

   - 修改文件
   - 在 Git 面板：
     - 为文件点击绿色 `+` / 使用 `Stage All`（= `git add`）
     - 在「Enter commit message」里写提交说明
     - `Commit Tracked` / `Ctrl+Enter` 提交
   - 用右下角的 `Publish` / `Push` 按钮推送到远程

这样，你实现了：

- **旧分支（main）保留 1-2-3-4 全部历史**
- **新分支（from-2）从 2 重新出发 2-3'-4'**

这是对你项目管理方式最稳妥、最推荐的一种使用姿势。

---

## 11.2 如果希望“当前分支本身”退回到某个提交

有时你可能希望：
**当前分支（例如 `main`）就回到 2，好像 3、4 从来没发生过。**

这属于「修改历史」，要区分两种方式：

- `reset`：直接把分支指针移回去（可能需要强推）
- `revert`：通过新提交「反向应用」旧提交，保留完整历史

### 11.2.1 `git reset --hard`：真正把分支退回到某个提交

> 只在以下情况下使用：
> - 这个分支基本只有你自己在用
> - 即使已经推到远程，你也能接受 `git push --force` 改写远程历史

#### 命令行步骤

假设当前在 `main` 上，历史为 `1 - 2 - 3 - 4 (HEAD -> main)`：

1. 找到 2 的哈希：

   ```powershell
   git log --oneline
   ```

   例如：

   ```text
   e4f5g6h4 4: wrong
   d3e4f5g3 3: ...
   a2b3c4d2 2: stable base
   ```

2. 把 `main` 直接退回到 2：

   ```powershell
   git reset --hard a2b3c4d2
   ```

   此时：

   - `HEAD -> main -> 2`
   - 工作区文件也回到 2 的版本
   - 3、4 这两个提交不再出现在 `main` 的线性历史里（但对象还在）

3. 若远程 `origin/main` 上已包含 3、4，且你确认要覆盖远程历史：

   ```powershell
   git push --force origin main
   ```

4. 之后在 `main` 上继续正常开发、提交、推送即可。

#### 在 Zed 中配合操作

1. Zed 终端中执行上述 `git log`、`git reset --hard`、`git push --force`
2. 执行完后：
   - Git 面板会显示：当前分支只有到 2
   - 文件内容回到 2 的版本
3. 后续再用 Git 面板进行 `Stage` / `Commit Tracked` / `Push` 即可

> 警告：
> `reset --hard` + `push --force` 会影响远程上其他人已基于该分支的工作。
> 当前你的仓库多半只有你一个人用，相对安全，但仍建议**优先用 11.1 的「开新分支」方式**。

---

### 11.2.2 `git revert`：用新提交撤销旧提交（不改历史）

如果：

- 你已经把错误提交推给别人了
- 又不想改写远程历史（不想 `push --force`）

可以用 `git revert` 产生一个 **“撤销某个提交”的新提交**。

#### 只撤销最后一个错误提交 4

1. 当前在包含 4 的分支上：

   ```powershell
   git revert HEAD
   ```

   - Git 会创建一个新的提交 5
   - 5 的改动 = 将 4 的所有修改反向应用一次
   - 历史结构：

     ```text
     1 -- 2 -- 3 -- 4 -- 5 (HEAD)
     ```

   - 此时代码内容 ≈ 执行 3 后的状态

2. 推送：

   ```powershell
   git push
   ```

**在 Zed 中：**

- 在终端运行 `git revert HEAD`
- 若 Git 打开 Zed 作为编辑器让你写 revert 的信息：
  - 在新 tab 里写好 message，保存并关闭
- 回到 Git 面板，看到多了一个新的提交（撤销 4）
- 用 `Push` 按钮推送

#### 撤销一段区间（让效果接近“退回到 2”）

理论上可以：

```powershell
git revert <3的hash>..<4的hash-或-HEAD>
```

对 3、4 各做一次反向提交；但区间用法容易出错，新手阶段不建议频繁使用。
对于你当前工作流，**简单、清晰的方式仍然是「从 2 开新分支」**。

---

## 11.3 针对你现在的 AI 辅助开发流程的推荐策略

结合你的模式：

> 每做完一个模块：
> - 与 AI 协作
> - 完成后：commit + push 保存
> 偶尔会发现从某个阶段开始的设计方向错误，想「回到以前的一个版本重新来」

强烈建议遵循：

1. **永远保留“旧历史”**：
   不要轻易用 `reset --hard` + `push --force` 改远程主线；
2. **回到某个稳定点重新开始时，优先：从该提交新建分支**

实际操作模板：

1. 发现「从 4 开始不对，想回到 2」：
2. 在 Zed 终端中：

   ```powershell
   git log --oneline --graph --decorate --all  # 找到 2 的 hash，例如 a2b3c4d2
   git checkout -b from-2 a2b3c4d2
   git push -u origin from-2
   ```

3. 之后与 AI 的新一轮合作，全都在 `from-2` 上进行：
   - 改代码 → Zed Git 面板 `Stage` → 写 commit message → `Commit Tracked`
   - 用 `Push` 按钮推送
4. 如果又发现新错误，再从某个「已确认正确的 commit」开一个新分支，命名为 `from-2-v2`、`idea-B-from-2` 等，保证分支名能反映其起点与意图。

通过这种方式：

- 每次确定「这条线到现在整体是对的」就 push 保存
- 一旦后续方向错误，可以随时从任何一个「确认正确的点」重新起跑
- 所有旧的尝试都保留在 Git 历史 / 分支里，将来可以比较、借鉴或部分 cherry-pick

---

你可以把本章直接复制到现有笔记后，编号若有调整（比如你后面会再加其它主题），把 `11` 改成合适的章节号即可。
