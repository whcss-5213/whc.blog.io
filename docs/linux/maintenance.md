# 运维命令

## systemctl

- systemctl start nginx    # 启动
- systemctl stop nginx     # 停止
- systemctl restart nginx # 重启
- systemctl status nginx   # 查看状态
- systemctl enable nginx   # 开机自启
- systemctl disable nginx  # 关闭开机自
- journalctl -u nginx      # 查看服务日志
- journalctl -f            # 实时日志

## ps 

### 1. 最常用三种写法
```bash
ps aux  # 查看系统所有进程（最常用）
ps -ef  # 全格式查看所有进程（带 PPID）
ps aux --sort=-%cpu  # 按 CPU 降序排序
```

### 2. 字段含义（`ps aux`）
```
USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND
```
- **USER**：运行用户
- **PID**：进程ID
- **%CPU / %MEM**：CPU、内存占用
- **VSZ**：虚拟内存（KB）
- **RSS**：物理内存（KB）
- **STAT**：进程状态
- **TIME**：占用CPU总时间
- **COMMAND**：启动命令

### 3. 进程状态 STAT（看懂就够）
- **R**：运行中
- **S**：休眠（可唤醒）
- **D**：不可中断休眠（I/O 中，常见磁盘/网络）
- **Z**：僵尸进程（zombie，父进程没回收）
- **T**：停止/被调试
- **s**：会话组长
- **+**：前台进程
- **N**：低优先级

### 4. 常用过滤
```bash
ps aux | grep nginx    # 找某个进程
ps aux | grep java
ps -ef | grep mysql
```

### 5. 按资源排序
```bash
# 按 CPU 从高到低
ps aux --sort=-%cpu

# 按内存从高到低
ps aux --sort=-%mem
```

### 6. 只看 PID（方便脚本）
```bash
pgrep nginx            # 只输出 PID
ps aux | grep nginx | grep -v grep | awk '{print $2}'
```

### 7. `ps aux` 与 `ps -ef` 区别
- `ps aux`：BSD 风格，**侧重资源占用（CPU、MEM）**
- `ps -ef`：SystemV 风格，**侧重父子进程关系（PPID）**
  
## lsof

> **`lsof`** = **List Open Files**，是 Linux/Unix 下查看**进程打开了哪些文件、端口、设备**的神器

### 一、输出字段
``` bash
COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF   NODE NAME
nginx    123 root  cwd    DIR  8,1      4096      2 /
nginx    123 root  txt    REG  8,1   123456  12345 /usr/sbin/nginx
nginx    123 root   4u  IPv4  0t0      TCP *:80 (LISTEN)
```
- **COMMAND**：进程名
- **PID**：进程ID
- **USER**：运行用户
- **FD**：文件描述符（`cwd`/`txt`/`r`/`w`/`u`/端口等）
- **TYPE**：文件类型（`REG`文件/`DIR`目录/`IPv4`/`IPv6`）
- **NAME**：文件/端口/路径

### 二、常用命令（90%场景）
#### 1. 查端口占用（最常用）
```bash
# 查谁占用 80 端口
lsof -i :80

# 查所有 TCP 连接
lsof -i TCP

# 查所有 UDP
lsof -i UDP

# 查 IPv4/IPv6
lsof -i 4
lsof -i 6
```

#### 2. 查文件/目录被谁占用
```bash
# 查文件
lsof /var/log/nginx/access.log

# 查目录（含子目录）
lsof +D /var/log/nginx

# 卸载磁盘提示 busy 时
lsof /mnt/usb
```

#### 3. 按进程查
```bash
# PID 123 打开的所有文件
lsof -p 123

# 命令名含 nginx 的进程
lsof -c nginx

# 只输出 PID（方便 kill）
lsof -t -i :80 | xargs kill -9
```

#### 4. 按用户查
```bash
lsof -u root
lsof -u www-data
```

#### 5. 查“已删但仍占用”文件（磁盘空间不释放）
```bash
lsof +L1
# 结果带 (deleted) 就是：文件已删，但进程还拿着句柄
```

#### 6. 组合条件（AND）
```bash
# 用户 www 且 端口 80
lsof -a -u www -i :80
```

### 三、常用参数速记
- `-i`：网络连接/端口
- `-p`：按 PID
- `-c`：按进程名
- `-u`：按用户
- `-t`：只输出 PID
- `-n`：不解析 IP→域名（快）
- `-P`：不解析端口号→服务名（快）
- `+D`：递归目录
- `+L1`：已删除但被占用文件

### 四、典型排障场景
- **端口被占**：`lsof -i :3306` → 杀进程
- **文件无法删/umount busy**：`lsof /path` → 找到占用者
- **磁盘满但 du 找不到**：`lsof +L1` → 清僵尸文件
- **进程异常**：`lsof -p PID` 看它打开了什么
