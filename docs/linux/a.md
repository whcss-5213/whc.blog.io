

## systemctl

systemctl start nginx    # 启动
systemctl stop nginx     # 停止
systemctl restart nginx # 重启
systemctl status nginx   # 查看状态
systemctl enable nginx   # 开机自启
systemctl disable nginx  # 关闭开机自启
journalctl -u nginx      # 查看服务日志
journalctl -f            # 实时日志


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
