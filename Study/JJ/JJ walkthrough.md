# JJ 使用指南

---

## 1. 初始化项目

```bash
jj git init
```

---

## 2. 添加文件并描述

添加或修改文件后：

```bash
# 查看当前状态
jj st

# 描述本次修订
jj describe -m "初始化项目"
```

---

## 3. 固定当前状态，进入下一步

### 方式一：进入下一步时设定描述

```bash
jj new -m "添加登录功能"
```

### 方式二：先进入下一步，之后再描述

```bash
jj new

# 修改文件...

jj describe -m "添加登录功能"
```

---

## 4. 重复以上过程

```bash
# 修改文件...
jj describe -m "修复 bug"
jj new -m "优化性能"

# 修改文件...
# 查看变更内容
jj diff
```

---

## 5. 不满意时，回到上一步

```bash
# 抛弃当前修订，回到上一步
jj abandon
```

---

## 6. 满意后，推送到远程

### 查看历史

```bash
jj log
```

假设显示：

```
@ wvp789  (当前空修订)
○ def456  优化性能
○ abc123  添加功能
○ main    初始提交
```

### 方式一：压缩后推送（简单，但本地历史丢失）

```bash
# 压缩所有历史为当前状态
jj squash

# 设置提交信息
jj describe -m "完成功能开发"

# 设置书签并推送
jj bookmark set main
jj git push
```

### 方式二：新建分支推送（保留本地历史）

```bash
# 新建一个修订
jj new

# 压缩指定范围的历史（起始ID::结束ID）
jj squash --from abc123::def456

# 设置提交信息
jj describe -m "完成功能开发"

# 设置书签并推送
jj bookmark set main
jj git push
```

---

## 7. 使用 Bookmark 管理位置

Bookmark 是 JJ 中的"书签"，**只是给修订起名字的标签**，方便记住和跳转位置。

### 核心概念

| 操作 | 作用 |
|------|------|
| `jj bookmark create xxx` | 给当前位置起名字（标签） |
| `jj new` | 在当前位置之后创建新修订 |
| `jj new --after <ID>` | 在指定位置之后创建新修订（创建分叉） |
| `jj edit <bookmark>` | 跳转到某个书签位置 |

**重点**：Bookmark 不会创建分叉，分叉是通过 `jj new --after <ID>` 决定的。

### Bookmark 常用命令

| 命令 | 作用 |
|------|------|
| `jj bookmark list` | 查看所有书签 |
| `jj bookmark create <名称>` | 创建书签 |
| `jj bookmark set <名称>` | 移动书签到当前修订 |
| `jj bookmark delete <名称>` | 删除书签 |

---

## 8. 分叉开发（多分支并行）

### 场景

从 A 点分叉，主干开发 B→D→F，分支开发 C→E→G：

```
A
├── B → D → F (主干)
└── C → E → G (分支)
```

### 操作流程

#### 第一步：主干开发

```bash
# 在 A 点创建书签，标记分叉点
jj bookmark create split-point

# 继续主干开发
jj new -m "B"
jj new -m "D"
jj new -m "F"
jj bookmark create main-dev  # 标记主干位置
```

#### 第二步：回到 A，开始分支

```bash
# 从 A 的位置开始新分支
jj new --after split-point -m "C"
jj new -m "E"
jj new -m "G"
jj bookmark create feature-dev  # 标记分支位置
```

#### 第三步：在两个分支间切换

```bash
jj edit main-dev     # 跳到 F
jj edit feature-dev  # 跳到 G
```

#### 第四步：推送主干 F

```bash
# 跳到 F 之后
jj new --after main-dev

# 压缩 A 到 F 的历史
jj squash --from <A的ID>::<F的ID>

jj describe -m "完成主干功能"
jj bookmark set main
jj git push
```

#### 第五步：推送分支 G

**方式一**：独立推送（可能有冲突）

```bash
jj new --after feature-dev
jj squash --from <A的ID>::<G的ID>
jj describe -m "完成分支功能"
jj bookmark set main
jj git push
```

**方式二**：先 rebase 到 F，再推送（包含主干内容）

```bash
# 把 C→E→G 整条线移到 F 之后
jj rebase -s <C的ID> -d <F的ID>

# 然后推送
jj new --after feature-dev
jj squash --from <F的ID>::<G的ID>
jj describe -m "完成分支功能"
jj bookmark set main
jj git push
```

---

## 常用命令速查

| 命令 | 作用 |
|------|------|
| `jj st` | 查看当前状态 |
| `jj diff` | 查看变更内容 |
| `jj log` | 查看历史 |
| `jj describe -m "..."` | 描述当前修订 |
| `jj new` | 进入下一步 |
| `jj new --after <ID>` | 从指定位置创建分叉 |
| `jj edit <ID/bookmark>` | 跳转到指定位置 |
| `jj abandon` | 抛弃当前修订 |
| `jj squash` | 压缩历史 |
| `jj rebase -s <源> -d <目标>` | 移动修订到新位置 |
