# Serv00 免费服务器部署完整指南

## 目录
1. [项目概述](#项目概述)
2. [SSH 连接服务器](#ssh-连接服务器)
3. [服务器环境准备](#服务器环境准备)
4. [上传项目代码](#上传项目代码)
5. [配置网站服务](#配置网站服务)
6. [设置进程守护](#设置进程守护)
7. [SSL 证书配置](#ssl-证书配置)
8. [使用自定义域名（Cloudflare）](#使用自定义域名cloudflare)
9. [常见问题排查](#常见问题排查)

---

## 项目概述

### 目标
在 Serv00 免费服务器上部署一个 Node.js 最简服务器，实现：
- 通过 Serv00 提供的域名访问
- 通过 Cloudflare 自定义域名访问
- 24/7 稳定运行

### 最简服务器代码

```javascript
// server.js
const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Hello World!</h1><p>服务器运行正常</p>');
});

server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
```

---

## SSH 连接服务器

### 为什么需要 SSH？
SSH（Secure Shell）是远程登录服务器的安全协议，允许你在本地电脑上操作远程服务器的命令行。

### 连接方式

#### Windows 用户（PowerShell 或 CMD）
```bash
ssh 用户名@服务器地址
```

#### 示例
```bash
ssh darkstarrd-dev@s12.serv00.com
```

### 首次连接
首次连接会提示确认服务器指纹：
```
The authenticity of host 's12.serv00.com' can't be established.
Are you sure you want to continue connecting (yes/no)?
```
输入 `yes` 继续。

### 登录信息来源
- **用户名**：Serv00 注册时的用户名
- **密码**：注册邮件中提供的密码
- **服务器地址**：注册邮件中指定的服务器（如 s12.serv00.com）

---

## 服务器环境准备

### 检查可用端口

#### 为什么要检查端口？
Serv00 免费服务器不允许使用任意端口，只分配特定端口给用户。使用未授权的端口会导致服务无法启动。

#### 查看命令
```bash
devil port list
```

#### 输出示例
```
Port   Type

8188   tcp
```

#### 端口不足时添加
```bash
devil port add tcp 3000
```

### 检查 Node.js 环境

#### 为什么要检查？
确保服务器已安装 Node.js，且版本符合项目要求。

```bash
node --version
npm --version
```

### 查看公网 IP 地址

#### 为什么需要？
后续配置 SSL 证书和域名绑定需要用到服务器的公网 IP。

```bash
devil vhost list
```

#### 输出示例
```
Public addresses

IP Address           RevDNS

213.189.53.91        s12.serv00.com
85.194.246.115       cache12.serv00.com
85.194.246.69        web12.serv00.com
```

**重要**：`web12.serv00.com` 对应的 IP（如 85.194.246.69）是网站服务使用的地址。

---

## 上传项目代码

### 创建项目目录

```bash
mkdir ~/myserver
cd ~/myserver
```

### 方法一：直接创建文件（推荐简单项目）

#### 为什么用这种方法？
对于简单的单文件项目，直接在服务器上创建比上传更快捷。

```bash
cat > server.js << 'EOF'
const http = require('http');

const PORT = process.env.PORT || 8188;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Hello World!</h1><p>服务器运行正常</p>');
});

server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
EOF
```

**注意**：`PORT` 必须使用 `devil port list` 显示的已授权端口。

### 方法二：使用 SCP 上传（推荐复杂项目）

#### 为什么用 SCP？
SCP（Secure Copy）通过 SSH 加密传输文件，适合上传多个文件或整个项目目录。

#### 上传单个文件
```bash
scp server.js 用户名@服务器地址:~/myserver/
```

#### 上传整个目录
```bash
scp -r ./myproject 用户名@服务器地址:~/
```

### 方法三：使用 Git 克隆

#### 为什么用 Git？
适合从 GitHub/GitLab 等平台部署项目，便于后续更新。

```bash
cd ~
git clone https://github.com/你的用户名/你的仓库.git myserver
cd myserver
npm install
```

### 验证文件上传

```bash
ls -la ~/myserver/
cat ~/myserver/server.js
```

---

## 配置网站服务

### 理解 Serv00 的网站架构

```
用户请求 → Serv00 反向代理 → 你的 Node.js 应用
                ↓
         (公网域名/IP)          (本地端口 127.0.0.1:8188)
```

### 删除默认网站配置

#### 为什么要删除？
Serv00 默认创建一个静态网站，需要替换为 Node.js 代理配置。

```bash
devil www del 用户名.serv00.net
```

### 添加反向代理配置

#### 为什么用反向代理？
Node.js 应用运行在本地端口（如 8188），反向代理将公网请求转发到该端口。

```bash
devil www add 用户名.serv00.net proxy localhost 8188
```

### 验证配置

```bash
devil www list
```

#### 预期输出
```
Domain                                 Type     Directory / Target address

darkstarrd-dev.serv00.net              proxy    http://127.0.0.1:8188
```

### 手动测试运行

#### 为什么要手动测试？
在配置自动化之前，先确认应用能正常启动和响应。

```bash
cd ~/myserver
node server.js
```

#### 测试访问
打开浏览器访问：`http://用户名.serv00.net`

#### 停止测试
按 `Ctrl + C` 停止服务器。

---

## 设置进程守护

### 为什么需要进程守护？

问题：
- SSH 断开后，直接运行的 `node server.js` 会终止
- 服务器重启后，应用不会自动启动
- 应用崩溃后无法自动恢复

解决方案：使用 Serv00 的 `devil` 进程管理器。

### 添加守护进程

```bash
devil www options 用户名.serv00.net pm add /home/用户名/myserver/server.js
```

#### 参数说明
- `用户名.serv00.net`：你的网站域名
- `/home/用户名/myserver/server.js`：Node.js 入口文件的**完整绝对路径**

### 管理守护进程

#### 查看状态
```bash
devil www options 用户名.serv00.net pm list
```

#### 重启进程
```bash
devil www options 用户名.serv00.net pm restart
```

#### 停止进程
```bash
devil www options 用户名.serv00.net pm stop
```

#### 删除进程
```bash
devil www options 用户名.serv00.net pm del /home/用户名/myserver/server.js
```

### 验证守护进程运行

```bash
ps aux | grep node
```

#### 预期输出
```
darkMDASH  12345  0.5  1.2  node /home/darkstarrd-dev/myserver/server.js
```

---

## SSL 证书配置

### 为什么需要 SSL？

1. **安全性**：加密传输数据，防止中间人攻击
2. **SEO**：搜索引擎优先收录 HTTPS 网站
3. **浏览器要求**：现代浏览器对 HTTP 网站显示"不安全"警告
4. **Cloudflare 要求**：使用 Cloudflare 代理时需要源站 SSL

### 查看当前 SSL 状态

```bash
devil ssl www list
```

### 添加 Let's Encrypt 免费证书

```bash
devil ssl www add IP地址 le le 域名
```

#### 示例
```bash
devil ssl www add 85.194.246.69 le le darkstarrd-dev.serv00.net
```

#### 参数说明
- `85.194.246.69`：`devil vhost list` 中 web 服务器的 IP
- `le le`：使用 Let's Encrypt 自动签发
- `darkstarrd-dev.serv00.net`：要添加证书的域名

### 验证证书

```bash
devil ssl www list
```

访问 `https://用户名.serv00.net` 确认 HTTPS 正常工作。

---

## 使用自定义域名（Cloudflare）

### 架构说明

```
用户 → Cloudflare CDN → Serv00 服务器 → Node.js 应用
         (代理/缓存)      (源站)
```

### 步骤一：在 Cloudflare 添加 DNS 记录

1. 登录 Cloudflare Dashboard
2. 选择你的域名
3. 进入 **DNS** 设置
4. 添加 A 记录：
   - **Type**: A
   - **Name**: 你想要的子域名（如 `app`）
   - **IPv4 address**: Serv00 的 web IP（如 `85.194.246.69`）
   - **Proxy status**: 先设为 **DNS only**（灰色云朵）

### 步骤二：在 Serv00 添加域名

```bash
devil www add 你的域名.dpdns.org proxy localhost 8188
```

#### 示例
```bash
devil www add rainboweldercat.dpdns.org proxy localhost 8188
```

### 步骤三：添加 SSL 证书

#### 为什么必须先关闭 Cloudflare 代理？
Let's Encrypt 需要直接访问你的服务器来验证域名所有权。开启 Cloudflare 代理会返回多个 IP，导致验证失败。

```bash
devil ssl www add 85.194.246.69 le le 你的域名.dpdns.org
```

### 步骤四：配置 Cloudflare SSL 模式

1. 在 Cloudflare 进入 **SSL/TLS** → **Overview**
2. 选择加密模式：

| 模式 | 说明 | 推荐场景 |
|------|------|----------|
| **Full** | 加密但不验证源站证书 | 源站有自签名证书 |
| **Full (Strict)** | 加密且验证源站证书 | 源站有有效 SSL 证书 ✓ |

如果已成功添加 Let's Encrypt 证书，选择 **Full (Strict)**。

### 步骤五：开启 Cloudflare 代理

SSL 证书添加成功后：
1. 回到 Cloudflare DNS 设置
2. 点击灰色云朵，变为 **橙色**（Proxied）

### 验证配置

```bash
devil www list
```

#### 预期输出
```
Domain                                 Type     Directory / Target address

darkstarrd-dev.serv00.net              proxy    http://127.0.0.1:8188
rainboweldercat.dpdns.org              proxy    http://127.0.0.1:8188
```

访问 `https://你的域名.dpdns.org` 确认正常工作。

---

## 常见问题排查

### 问题 1：端口被占用或无权限

**错误信息**：
```
Error: listen EACCES: permission denied 0.0.0.0:3000
```

**原因**：使用了未授权的端口

**解决**：
```bash
devil port list          # 查看可用端口
devil port add tcp 3000  # 添加新端口（如需要）
```

修改 `server.js` 中的 `PORT` 为授权端口。

### 问题 2：502 Bad Gateway

**原因**：反向代理无法连接到 Node.js 应用

**排查步骤**：
```bash
# 1. 检查进程是否运行
ps aux | grep node

# 2. 检查端口配置是否匹配
devil www list
cat ~/myserver/server.js | grep PORT

# 3. 重启进程
devil www options 用户名.serv00.net pm restart
```

### 问题 3：Cloudflare 526 错误（Invalid SSL certificate）

**原因**：Cloudflare 设置为 Full (Strict)，但源站无有效 SSL 证书

**解决方案 A**（快速）：
- 将 Cloudflare SSL 模式改为 **Full**

**解决方案 B**（推荐）：
```bash
# 1. 关闭 Cloudflare 代理（灰色云朵）
# 2. 添加证书
devil ssl www add 85.194.246.69 le le 你的域名

# 3. 重新开启 Cloudflare 代理（橙色云朵）
```

### 问题 4：Let's Encrypt 证书申请失败

**错误信息**：
```
[Error] Domain has more than one A record
```

**原因**：Cloudflare 代理开启时返回多个 IP

**解决**：
1. 在 Cloudflare DNS 中关闭代理（灰色云朵）
2. 等待 DNS 生效（1-5 分钟）
3. 重新申请证书
4. 成功后再开启代理

### 问题 5：代理目标使用了 HTTPS

**错误配置**：
```
rainboweldercat.dpdns.org    proxy    https://127.0.0.1:8188
```

**原因**：Node.js 应用本身是 HTTP 服务，不应使用 HTTPS 连接

**解决**：
```bash
devil www del 你的域名
devil www add 你的域名 proxy localhost 8188
```

---

## 完整部署清单

### Serv00 原生域名部署

- [ ] SSH 登录服务器
- [ ] 检查可用端口 (`devil port list`)
- [ ] 创建项目目录和代码
- [ ] 删除默认网站 (`devil www del`)
- [ ] 添加反向代理 (`devil www add ... proxy`)
- [ ] 手动测试运行
- [ ] 添加进程守护 (`devil www options ... pm add`)
- [ ] 添加 SSL 证书 (`devil ssl www add`)
- [ ] 验证 HTTPS 访问

### Cloudflare 自定义域名部署

- [ ] 在 Cloudflare 添加 DNS A 记录（先关闭代理）
- [ ] 在 Serv00 添加域名 (`devil www add`)
- [ ] 添加 SSL 证书
- [ ] 配置 Cloudflare SSL 模式为 Full (Strict)
- [ ] 开启 Cloudflare 代理
- [ ] 验证 HTTPS 访问

---

## 常用命令速查

| 功能 | 命令 |
|------|------|
| 查看端口 | `devil port list` |
| 添加端口 | `devil port add tcp 端口号` |
| 查看网站 | `devil www list` |
| 删除网站 | `devil www del 域名` |
| 添加代理网站 | `devil www add 域名 proxy localhost 端口` |
| 查看进程 | `devil www options 域名 pm list` |
| 重启进程 | `devil www options 域名 pm restart` |
| 添加进程 | `devil www options 域名 pm add 脚本路径` |
| 查看 SSL | `devil ssl www list` |
| 添加 SSL | `devil ssl www add IP le le 域名` |
| 查看公网 IP | `devil vhost list` |

# Serv00 免费服务器部署完整指南

## 目录
1. [项目概述](#项目概述)
2. [SSH 连接服务器](#ssh-连接服务器)
3. [服务器环境准备](#服务器环境准备)
4. [Node.js 环境配置](#nodejs-环境配置)
5. [上传项目代码](#上传项目代码)
6. [安装依赖与构建](#安装依赖与构建)
7. [配置网站服务](#配置网站服务)
8. [设置进程守护](#设置进程守护)
9. [SSL 证书配置](#ssl-证书配置)
10. [使用自定义域名（Cloudflare）](#使用自定义域名cloudflare)
11. [常见问题排查](#常见问题排查)

---

## 项目概述

### 目标
在 Serv00 免费服务器上部署一个 Node.js 最简服务器，实现：
- 通过 Serv00 提供的域名访问
- 通过 Cloudflare 自定义域名访问
- 24/7 稳定运行

### 最简服务器代码

```javascript
// server.js
const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Hello World!</h1><p>服务器运行正常</p>');
});

server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
```

---

## SSH 连接服务器

### 为什么需要 SSH？
SSH（Secure Shell）是远程登录服务器的安全协议，允许你在本地电脑上操作远程服务器的命令行。

### 连接方式

#### Windows 用户（PowerShell 或 CMD）
```bash
ssh 用户名@服务器地址
```

#### 示例
```bash
ssh darkstarrd-dev@s12.serv00.com
```

### 首次连接
首次连接会提示确认服务器指纹：
```
The authenticity of host 's12.serv00.com' can't be established.
Are you sure you want to continue connecting (yes/no)?
```
输入 `yes` 继续。

### 登录信息来源
- **用户名**：Serv00 注册时的用户名
- **密码**：注册邮件中提供的密码
- **服务器地址**：注册邮件中指定的服务器（如 s12.serv00.com）

---

## 服务器环境准备

### 检查可用端口

#### 为什么要检查端口？
Serv00 免费服务器不允许使用任意端口，只分配特定端口给用户。使用未授权的端口会导致服务无法启动。

#### 查看命令
```bash
devil port list
```

#### 输出示例
```
Port   Type

8188   tcp
```

#### 端口不足时添加
```bash
devil port add tcp 3000
```

### 查看公网 IP 地址

#### 为什么需要？
后续配置 SSL 证书和域名绑定需要用到服务器的公网 IP。

```bash
devil vhost list
```

#### 输出示例
```
Public addresses

IP Address           RevDNS

213.189.53.91        s12.serv00.com
85.194.246.115       cache12.serv00.com
85.194.246.69        web12.serv00.com
```

**重要**：`web12.serv00.com` 对应的 IP（如 85.194.246.69）是网站服务使用的地址。

---

## Node.js 环境配置

### 为什么要配置 Node.js 环境？
Serv00 服务器预装了多个 Node.js 版本，但默认可能不是最新版本。正确配置环境确保：
- 使用兼容项目的 Node.js 版本
- `node` 和 `npm` 命令全局可用
- 依赖包能正确安装和运行

### 检查当前 Node.js 状态

```bash
node --version
npm --version
```

如果提示 `command not found`，需要配置环境变量。

### 查看可用的 Node.js 版本

#### 为什么 Serv00 有多个版本？
不同项目可能需要不同的 Node.js 版本，Serv00 预装多个版本供用户选择。

```bash
ls /usr/local/bin/node*
```

#### 输出示例
```
/usr/local/bin/node
/usr/local/bin/node14
/usr/local/bin/node16
/usr/local/bin/node18
/usr/local/bin/node20
/usr/local/bin/node22
```

### 配置环境变量

#### 为什么要配置环境变量？
环境变量告诉系统去哪里找 `node` 和 `npm` 命令。配置后无需输入完整路径即可使用。

#### 编辑 Shell 配置文件
```bash
nano ~/.bashrc
```

#### 添加以下内容
```bash
# Node.js 环境配置
export PATH="/usr/local/bin:$PATH"

# 如果需要特定版本（如 Node 20），使用别名
alias node='/usr/local/bin/node20'
alias npm='/usr/local/bin/npm20'
```

#### 保存并退出
- 按 `Ctrl + O` 保存
- 按 `Enter` 确认
- 按 `Ctrl + X` 退出

#### 使配置生效
```bash
source ~/.bashrc
```

### 验证配置

```bash
node --version
npm --version
```

#### 预期输出
```
v20.x.x
10.x.x
```

### 选择合适的 Node.js 版本

| 版本 | 推荐场景 |
|------|----------|
| Node 18 | 稳定版，大多数项目兼容 |
| Node 20 | 最新 LTS，推荐新项目使用 |
| Node 22 | 最新版，需要最新特性时使用 |

#### 切换版本示例
如果项目需要 Node 18：
```bash
# 编辑 ~/.bashrc
alias node='/usr/local/bin/node18'
alias npm='/usr/local/bin/npm18'
```

---

## 上传项目代码

### 创建项目目录

```bash
mkdir ~/myserver
cd ~/myserver
```

### 方法一：直接创建文件（推荐简单项目）

#### 为什么用这种方法？
对于简单的单文件项目，直接在服务器上创建比上传更快捷。

#### 创建 server.js
```bash
cat > server.js << 'EOF'
const http = require('http');

const PORT = process.env.PORT || 8188;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Hello World!</h1><p>服务器运行正常</p>');
});

server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
EOF
```

**注意**：`PORT` 必须使用 `devil port list` 显示的已授权端口。

#### 创建 package.json（可选但推荐）
```bash
cat > package.json << 'EOF'
{
  "name": "myserver",
  "version": "1.0.0",
  "description": "最简 Node.js 服务器",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF
```

### 方法二：使用 SCP 上传（推荐复杂项目）

#### 为什么用 SCP？
SCP（Secure Copy）通过 SSH 加密传输文件，适合上传多个文件或整个项目目录。

#### 上传单个文件
```bash
# 在本地电脑执行
scp server.js 用户名@服务器地址:~/myserver/
```

#### 上传整个目录
```bash
# 在本地电脑执行
scp -r ./myproject 用户名@服务器地址:~/
```

#### 上传 package.json 和源码（不上传 node_modules）
```bash
# 在本地电脑执行
scp package.json server.js 用户名@服务器地址:~/myserver/
```

### 方法三：使用 Git 克隆

#### 为什么用 Git？
适合从 GitHub/GitLab 等平台部署项目，便于后续更新。

```bash
cd ~
git clone https://github.com/你的用户名/你的仓库.git myserver
cd myserver
```

### 验证文件上传

```bash
ls -la ~/myserver/
cat ~/myserver/server.js
```

---

## 安装依赖与构建

### 理解 package.json

#### 为什么需要 package.json？
`package.json` 是 Node.js 项目的配置文件，定义了：
- 项目名称和版本
- 依赖的第三方库
- 启动脚本
- Node.js 版本要求

#### 最简 package.json 示例
```json
{
  "name": "myserver",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  }
}
```

#### 带依赖的 package.json 示例
```json
{
  "name": "myserver",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "build": "echo 'No build step required'"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

### 安装依赖

#### 为什么要安装依赖？
`package.json` 中的 `dependencies` 列出了项目运行所需的第三方库，`npm install` 会下载这些库到 `node_modules` 目录。

```bash
cd ~/myserver
npm install
```

#### 输出示例
```
added 50 packages in 5s
```

### 常用 npm 命令

| 命令 | 作用 |
|------|------|
| `npm install` | 安装所有依赖 |
| `npm install 包名` | 安装指定包并添加到 dependencies |
| `npm install 包名 --save-dev` | 安装开发依赖 |
| `npm update` | 更新所有依赖 |
| `npm list` | 查看已安装的依赖 |

### 选择合适的框架

#### 原生 HTTP（本指南使用）

**优点**：无需额外依赖，最简单
**适用**：学习、简单 API

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

server.listen(8188);
```

#### Express（推荐生产使用）

**优点**：路由方便，生态丰富
**适用**：REST API、Web 应用

```bash
npm install express
```

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(8188);
```

#### Fastify（高性能场景）

**优点**：性能比 Express 更好
**适用**：高并发 API

```bash
npm install fastify
```

```javascript
const fastify = require('fastify')();

fastify.get('/', async (req, reply) => {
  return { hello: 'world' };
});

fastify.listen({ port: 8188 });
```

### 构建项目（如需要）

#### 什么时候需要构建？
- 使用 TypeScript 编写代码
- 使用 Babel 转译新语法
- 打包前端资源

#### TypeScript 项目示例

##### package.json
```json
{
  "name": "myserver",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

##### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  }
}
```

##### 构建命令
```bash
npm install
npm run build
```

### 测试运行

#### 为什么要手动测试？
在配置自动化之前，先确认应用能正常启动和响应。

```bash
cd ~/myserver
node server.js
```

#### 预期输出
```
服务器运行在端口 8188
```

#### 测试访问（保持上面的终端运行，新开一个 SSH 连接）
```bash
curl http://localhost:8188
```

#### 预期响应
```html
<h1>Hello World!</h1><p>服务器运行正常</p>
```

#### 停止测试
回到运行 server.js 的终端，按 `Ctrl + C` 停止。

---

## 配置网站服务

### 理解 Serv00 的网站架构

```
用户请求 → Serv00 反向代理 → 你的 Node.js 应用
                ↓
         (公网域名/IP)          (本地端口 127.0.0.1:8188)
```

### 删除默认网站配置

#### 为什么要删除？
Serv00 默认创建一个静态网站，需要替换为 Node.js 代理配置。

```bash
devil www del 用户名.serv00.net
```

### 添加反向代理配置

#### 为什么用反向代理？
Node.js 应用运行在本地端口（如 8188），反向代理将公网请求转发到该端口。

```bash
devil www add 用户名.serv00.net proxy localhost 8188
```

### 验证配置

```bash
devil www list
```

#### 预期输出
```
Domain                                 Type     Directory / Target address

darkstarrd-dev.serv00.net              proxy    http://127.0.0.1:8188
```

### 浏览器测试

打开浏览器访问：`http://用户名.serv00.net`

应该看到：
```
Hello World!
服务器运行正常
```

---

## 设置进程守护

### 为什么需要进程守护？

问题：
- SSH 断开后，直接运行的 `node server.js` 会终止
- 服务器重启后，应用不会自动启动
- 应用崩溃后无法自动恢复

解决方案：使用 Serv00 的 `devil` 进程管理器。

### 添加守护进程

```bash
devil www options 用户名.serv00.net pm add /home/用户名/myserver/server.js
```

#### 参数说明
- `用户名.serv00.net`：你的网站域名
- `/home/用户名/myserver/server.js`：Node.js 入口文件的**完整绝对路径**

#### 注意事项
- 路径必须是绝对路径，以 `/home/` 开头
- 入口文件必须是 `.js` 文件
- 如果是 TypeScript 项目，指向编译后的 `dist/server.js`

### 管理守护进程

#### 查看状态
```bash
devil www options 用户名.serv00.net pm list
```

#### 重启进程
```bash
devil www options 用户名.serv00.net pm restart
```

#### 停止进程
```bash
devil www options 用户名.serv00.net pm stop
```

#### 删除进程
```bash
devil www options 用户名.serv00.net pm del /home/用户名/myserver/server.js
```

### 验证守护进程运行

```bash
ps aux | grep node
```

#### 预期输出
```
darkstarrd  12345  0.5  1.2  node /home/darkstarrd-dev/myserver/server.js
```

### 更新代码后重启

当你修改了 `server.js` 后，需要重启进程使更改生效：

```bash
devil www options 用户名.serv00.net pm restart
```

---

## SSL 证书配置

### 为什么需要 SSL？

1. **安全性**：加密传输数据，防止中间人攻击
2. **SEO**：搜索引擎优先收录 HTTPS 网站
3. **浏览器要求**：现代浏览器对 HTTP 网站显示"不安全"警告
4. **Cloudflare 要求**：使用 Cloudflare 代理时需要源站 SSL

### 查看当前 SSL 状态

```bash
devil ssl www list
```

### 添加 Let's Encrypt 免费证书

```bash
devil ssl www add IP地址 le le 域名
```

#### 示例
```bash
devil ssl www add 85.194.246.69 le le darkstarrd-dev.serv00.net
```

#### 参数说明
- `85.194.246.69`：`devil vhost list` 中 web 服务器的 IP
- `le le`：使用 Let's Encrypt 自动签发
- `darkstarrd-dev.serv00.net`：要添加证书的域名

### 验证证书

```bash
devil ssl www list
```

访问 `https://用户名.serv00.net` 确认 HTTPS 正常工作。

---

## 使用自定义域名（Cloudflare）

### 架构说明

```
用户 → Cloudflare CDN → Serv00 服务器 → Node.js 应用
         (代理/缓存)      (源站)
```

### 步骤一：在 Cloudflare 添加 DNS 记录

1. 登录 Cloudflare Dashboard
2. 选择你的域名
3. 进入 **DNS** 设置
4. 添加 A 记录：
   - **Type**: A
   - **Name**: 你想要的子域名（如 `app`）
   - **IPv4 address**: Serv00 的 web IP（如 `85.194.246.69`）
   - **Proxy status**: 先设为 **DNS only**（灰色云朵）

### 步骤二：在 Serv00 添加域名

```bash
devil www add 你的域名.dpdns.org proxy localhost 8188
```

#### 示例
```bash
devil www add rainboweldercat.dpdns.org proxy localhost 8188
```

### 步骤三：添加 SSL 证书

#### 为什么必须先关闭 Cloudflare 代理？
Let's Encrypt 需要直接访问你的服务器来验证域名所有权。开启 Cloudflare 代理会返回多个 IP，导致验证失败。

```bash
devil ssl www add 85.194.246.69 le le 你的域名.dpdns.org
```

### 步骤四：配置 Cloudflare SSL 模式

1. 在 Cloudflare 进入 **SSL/TLS** → **Overview**
2. 选择加密模式：

| 模式 | 说明 | 推荐场景 |
|------|------|----------|
| **Full** | 加密但不验证源站证书 | 源站有自签名证书 |
| **Full (Strict)** | 加密且验证源站证书 | 源站有有效 SSL 证书 ✓ |

如果已成功添加 Let's Encrypt 证书，选择 **Full (Strict)**。

### 步骤五：开启 Cloudflare 代理

SSL 证书添加成功后：
1. 回到 Cloudflare DNS 设置
2. 点击灰色云朵，变为 **橙色**（Proxied）

### 验证配置

```bash
devil www list
```

#### 预期输出
```
Domain                                 Type     Directory / Target address

darkstarrd-dev.serv00.net              proxy    http://127.0.0.1:8188
rainboweldercat.dpdns.org              proxy    http://127.0.0.1:8188
```

访问 `https://你的域名.dpdns.org` 确认正常工作。

---

## 常见问题排查

### 问题 1：端口被占用或无权限

**错误信息**：
```
Error: listen EACCES: permission denied 0.0.0.0:3000
```

**原因**：使用了未授权的端口

**解决**：
```bash
devil port list          # 查看可用端口
devil port add tcp 3000  # 添加新端口（如需要）
```

修改 `server.js` 中的 `PORT` 为授权端口。

### 问题 2：502 Bad Gateway

**原因**：反向代理无法连接到 Node.js 应用

**排查步骤**：
```bash
# 1. 检查进程是否运行
ps aux | grep node

# 2. 检查端口配置是否匹配
devil www list
cat ~/myserver/server.js | grep PORT

# 3. 重启进程
devil www options 用户名.serv00.net pm restart
```

### 问题 3：Cloudflare 526 错误（Invalid SSL certificate）

**原因**：Cloudflare 设置为 Full (Strict)，但源站无有效 SSL 证书

**解决方案 A**（快速）：
- 将 Cloudflare SSL 模式改为 **Full**

**解决方案 B**（推荐）：
```bash
# 1. 关闭 Cloudflare 代理（灰色云朵）
# 2. 添加证书
devil ssl www add 85.194.246.69 le le 你的域名

# 3. 重新开启 Cloudflare 代理（橙色云朵）
```

### 问题 4：Let's Encrypt 证书申请失败

**错误信息**：
```
[Error] Domain has more than one A record
```

**原因**：Cloudflare 代理开启时返回多个 IP

**解决**：
1. 在 Cloudflare DNS 中关闭代理（灰色云朵）
2. 等待 DNS 生效（1-5 分钟）
3. 重新申请证书
4. 成功后再开启代理

### 问题 5：代理目标使用了 HTTPS

**错误配置**：
```
rainboweldercat.dpdns.org    proxy    https://127.0.0.1:8188
```

**原因**：Node.js 应用本身是 HTTP 服务，不应使用 HTTPS 连接

**解决**：
```bash
devil www del 你的域名
devil www add 你的域名 proxy localhost 8188
```

### 问题 6：npm install 失败

**错误信息**：
```
npm ERR! code EACCES
npm ERR! permission denied
```

**解决**：
```bash
# 确保在自己的目录下操作
cd ~/myserver
npm install --no-optional
```

### 问题 7：node 命令找不到

**错误信息**：
```
bash: node: command not found
```

**解决**：
```bash
# 检查 Node.js 位置
ls /usr/local/bin/node*

# 使用完整路径
/usr/local/bin/node20 server.js

# 或配置环境变量（见 Node.js 环境配置章节）
```

---

## 完整部署清单

### Serv00 原生域名部署

- [ ] SSH 登录服务器
- [ ] 检查可用端口 (`devil port list`)
- [ ] 配置 Node.js 环境变量
- [ ] 验证 `node --version` 和 `npm --version`
- [ ] 创建项目目录 (`mkdir ~/myserver`)
- [ ] 上传或创建项目代码
- [ ] 创建 `package.json`
- [ ] 安装依赖 (`npm install`)
- [ ] 手动测试运行 (`node server.js`)
- [ ] 删除默认网站 (`devil www del`)
- [ ] 添加反向代理 (`devil www add ... proxy`)
- [ ] 添加进程守护 (`devil www options ... pm add`)
- [ ] 添加 SSL 证书 (`devil ssl www add`)
- [ ] 验证 HTTPS 访问

### Cloudflare 自定义域名部署

- [ ] 在 Cloudflare 添加 DNS A 记录（先关闭代理）
- [ ] 在 Serv00 添加域名 (`devil www add`)
- [ ] 添加 SSL 证书
- [ ] 配置 Cloudflare SSL 模式为 Full (Strict)
- [ ] 开启 Cloudflare 代理
- [ ] 验证 HTTPS 访问

---

## 常用命令速查

### 端口管理
| 命令 | 作用 |
|------|------|
| `devil port list` | 查看已分配端口 |
| `devil port add tcp 端口号` | 添加新端口 |

### 网站管理
| 命令 | 作用 |
|------|------|
| `devil www list` | 查看所有网站 |
| `devil www del 域名` | 删除网站 |
| `devil www add 域名 proxy localhost 端口` | 添加代理网站 |

### 进程管理
| 命令 | 作用 |
|------|------|
| `devil www options 域名 pm list` | 查看进程状态 |
| `devil www options 域名 pm add 脚本路径` | 添加守护进程 |
| `devil www options 域名 pm restart` | 重启进程 |
| `devil www options 域名 pm stop` | 停止进程 |
| `devil www options 域名 pm del 脚本路径` | 删除进程 |

### SSL 管理
| 命令 | 作用 |
|------|------|
| `devil ssl www list` | 查看 SSL 证书 |
| `devil ssl www add IP le le 域名` | 添加 Let's Encrypt 证书 |

### 其他
| 命令 | 作用 |
|------|------|
| `devil vhost list` | 查看公网 IP |
| `ps aux \| grep node` | 查看 Node.js 进程 |
| `curl http://localhost:端口` | 本地测试 |

### npm 命令
| 命令 | 作用 |
|------|------|
| `npm install` | 安装所有依赖 |
| `npm install 包名` | 安装指定包 |
| `npm run start` | 运行 start 脚本 |
| `npm run build` | 运行 build 脚本 |
| `npm list` | 查看已安装依赖 |
