# PM2 常用命令完全手册


## 一、基础进程管理

核心用于启动、停止、重启、删除项目进程，是日常开发/部署最高频操作。

```bash
# 1. 启动项目（基础版）
pm2 start app.js  # 启动默认进程（ID 自增，名称默认为 app）
pm2 start main.js --name "my-api"  # 自定义进程名称（推荐，便于后续管理）
pm2 start app.js -i 2  # 开启 2 个进程（集群模式，适用于多核CPU）
pm2 start app.js --watch  # 监听文件变化，自动重启（开发环境常用）

# 2. 重启进程
pm2 restart 0  # 根据进程 ID 重启（ID 可通过 pm2 list 查看）
pm2 restart my-api  # 根据进程名称重启
pm2 restart all  # 重启所有进程
pm2 restart all --watch  # 重启所有进程并开启监听

# 3. 停止进程（不删除，可重新启动）
pm2 stop 0  # 根据 ID 停止
pm2 stop my-api  # 根据名称停止
pm2 stop all  # 停止所有进程

# 4. 删除进程（永久移除，需重新启动才会出现）
pm2 delete 0  # 删除指定 ID 进程（如删除 ID 为 0 的进程）
pm2 delete my-api  # 删除指定名称进程
pm2 delete all  # 删除所有进程

# 5. 查看进程列表（核心查看命令）
pm2 list  # 简洁查看所有进程状态
pm2 ls  # 简写，与 pm2 list 功能一致
pm2 status  # 详细查看进程状态（包含内存、CPU 占用）
```

## 二、日志管理（排查问题必备）

PM2 自动记录进程日志，无需额外配置，以下命令可快速查看、清理日志。

```bash
# 1. 实时查看所有进程日志（实时刷新，退出按 Ctrl+C）
pm2 logs

# 2. 查看指定进程日志
pm2 logs 0  # 查看 ID 为 0 的进程日志
pm2 logs my-api  # 查看指定名称的进程日志

# 3. 查看最近指定行数的日志
pm2 logs --lines 100  # 查看所有进程最近 100 行日志
pm2 logs my-api --lines 50  # 查看指定进程最近 50 行日志

# 4. 清空所有进程日志（谨慎使用）
pm2 flush

# 5. 查看日志文件路径（如需手动查看日志文件）
pm2 logs --path
```

## 三、进程快照（保存/恢复，开机自启用）

用于保存当前进程列表，实现开机自启，或误操作后恢复进程。

```bash
# 1. 保存当前所有进程（关键！配合开机自启使用）
pm2 save  # 将当前进程列表保存为快照，重启服务器后可恢复

# 2. 删除保存的进程快照（清空开机自启列表）
pm2 cleardump  # 删除快照，下次开机不会自动启动任何 PM2 进程

# 3. 恢复保存的进程快照
pm2 resurrect  # 恢复到上次 pm2 save 保存的进程状态

# 4. 查看快照信息
pm2 dump  # 查看当前快照内容
```

## 四、开机自启配置（服务器必备）

配置后，服务器重启时，PM2 会自动启动保存的进程，无需手动操作。

```bash
# 1. 生成开机自启脚本（根据系统自动适配）
pm2 startup  # 执行后会提示后续命令，复制执行即可

# 2. 取消开机自启
pm2 unstartup  # 取消开机自启配置，服务器重启后 PM2 不再自动启动

# 3. 完整开机自启流程（必记）
pm2 start app.js --name "my-api"  # 启动进程
pm2 save  # 保存进程快照
pm2 startup  # 生成开机自启脚本（按提示执行后续命令）
```

## 五、环境变量配置（多环境切换）

支持 3 种方式配置环境变量，推荐使用配置文件方式，便于维护。

### 方式 1：命令行直接传递（临时生效，适合快速测试）

```bash
# Linux/Mac
NODE_ENV=production PORT=3000 pm2 start app.js

# Windows cmd
set NODE_ENV=production&& pm2 start app.js

# Windows powerShell
$env:NODE_ENV="production"; pm2 start app.js
```

### 方式 2：.env 文件配置（推荐，适合开发/测试环境）

```bash
# 1. 项目根目录创建 .env 文件
# .env 文件内容
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/my-db

# 2. 安装 dotenv 依赖（解析 .env 文件）
npm install dotenv --save

# 3. 项目入口文件（app.js/main.js）顶部引入
require('dotenv').config();

# 4. 正常启动 PM2 即可（自动读取 .env 环境变量）
pm2 start app.js
```

### 方式 3：PM2 配置文件（最专业，适合生产环境，支持多环境切换）

```javascript
# 1. 项目根目录创建 ecosystem.config.js 配置文件
module.exports = {
  apps: [{
    name: "my-api",          // 进程名称
    script: "./app.js",      // 入口文件路径
    instances: "max",        // 开启最大进程数（多核CPU最优）
    exec_mode: "cluster",    // 集群模式（提升性能）
    // 开发环境变量
    env: {
      NODE_ENV: "development",
      PORT: 3000
    },
    // 生产环境变量（--env production 启动时生效）
    env_production: {
      NODE_ENV: "production",
      PORT: 8080
    }
  }]
}

# 2. 启动命令
pm2 start ecosystem.config.js  # 启动开发环境
pm2 start ecosystem.config.js --env production  # 启动生产环境
pm2 restart ecosystem.config.js --env production  # 重启生产环境
```

## 六、监控与调试（优化性能、排查问题）

```bash
# 1. 实时监控进程资源（CPU、内存、日志，退出按 Ctrl+C）
pm2 monit

# 2. 查看指定进程详情（包含环境变量、日志路径、启动命令等）
pm2 show 0  # 根据 ID 查看
pm2 info my-api  # 根据名称查看

# 3. 查看当前进程的环境变量
pm2 env 0  # 查看 ID 为 0 的进程环境变量
pm2 env my-api  # 查看指定名称进程的环境变量

# 4. 查看 PM2 版本及系统信息
pm2 -v  # 查看 PM2 版本
pm2 info  # 查看系统及 PM2 详细信息
```

## 七、高级操作（生产环境常用）

```bash
# 1. 零停机重启（生产上线必备，不中断服务）
pm2 reload all  # 平滑重启所有进程，避免服务中断
pm2 reload my-api  # 平滑重启指定进程

# 2. 重置进程重启次数（用于排查重启异常）
pm2 reset 0  # 重置 ID 为 0 的进程重启次数
pm2 reset all  # 重置所有进程重启次数

# 3. 设置进程自动重启规则
pm2 start app.js --max-restarts 5  # 最大重启次数 5 次（超过则停止）
pm2 start app.js --restart-delay 3000  # 重启间隔 3 秒（单位：毫秒）

# 4. 导出/导入进程配置
pm2 export  # 导出当前进程配置到文件
pm2 import config.json  # 从配置文件导入进程
```

## 八、常用命令速查（背会即可满足 99% 场景）

1. pm2 start app.js --name "my-api"  # 启动并命名进程

2. pm2 ls  # 查看所有进程

3. pm2 restart 0  # 重启指定 ID 进程

4. pm2 stop 0  # 停止指定 ID 进程

5. pm2 delete 0  # 删除指定 ID 进程

6. pm2 logs  # 实时查看所有日志

7. pm2 monit  # 监控进程资源

8. pm2 save  # 保存进程快照

9. pm2 startup  # 配置开机自启

10. pm2 reload all  # 零停机重启所有进程

## 九、常见问题解决

- 问题：pm2 save 后，删除进程重启服务器又出现？
解决：pm2 delete 0（删除进程） → pm2 cleardump（删除快照） → pm2 save（重新保存空快照）

- 问题：环境变量不生效？
解决：检查环境变量配置方式，重启进程（pm2 restart 0），通过 pm2 env 0 验证是否生效

- 问题：开机自启不生效？
解决：重新执行 pm2 startup（按提示复制命令），再执行 pm2 save
> 