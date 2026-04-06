# Linux 网络命令笔记
## 一、基础网络查看
### 1. ping — 测试连通性
```bash
ping baidu.com          # 一直 ping
ping -c 4 baidu.com      # 只发 4 个包
ping -i 0.5 baidu.com    # 间隔 0.5s
```

### 2. traceroute / mtr — 路由追踪
```bash
traceroute baidu.com
mtr baidu.com    # 实时、更直观（需安装）
```

### 3. nslookup / dig — DNS 解析
```bash
nslookup baidu.com
dig baidu.com
dig @8.8.8.8 baidu.com   # 指定 DNS 服务器
```



## 二、ip 命令（替代 ifconfig）
### 1. 查看网卡 / IP
```bash
ip a            # 所有网卡 IP
ip addr show
ip a show eth0  # 只看 eth0
```

### 2. 查看路由
```bash
ip r
ip route
ip route show
```

### 3. 网卡启停
```bash
ip link set eth0 up
ip link set eth0 down
```

### 4. 临时添加/删除 IP
```bash
ip addr add 192.168.1.100/24 dev eth0
ip addr del 192.168.1.100/24 dev eth0
```

### 5. ARP 表（查看 MAC）
```bash
ip n
ip neigh
ip neigh show
```


## 三、ss 命令（替代 netstat）
### 1. 查看所有连接
```bash
ss -a      # 所有
ss -l      # 仅监听
ss -t      # TCP
ss -u      # UDP
```

### 2. 最常用组合
```bash
ss -tulnp
```
- `-t` TCP
- `-u` UDP
- `-l` 监听
- `-n` 不解析域名
- `-p` 显示进程 PID/名称

### 3. 过滤端口
```bash
ss -tulnp | grep :22
ss -tulnp sport = :80
```

### 4. netstat 对比（老命令）
```bash
netstat -tulnp   # 效果类似 ss -tulnp
```

## 四、防火墙 — iptables（传统）
### 1. 查看规则
```bash
iptables -L -n
iptables -L -n --line-numbers  # 显示行号
```

### 2. 开放端口
```bash
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
```

### 3. 禁止端口/IP
```bash
iptables -A INPUT -p tcp --dport 3306 -j DROP
iptables -A INPUT -s 192.168.1.100 -j DROP
```

### 4. 删除规则
```bash
iptables -D INPUT 行号
```

### 5. 清空规则
```bash
iptables -F
iptables -t nat -F
```

## 五、防火墙 — nftables（新一代）
### 1. 基础查看
```bash
nft list ruleset
```

### 2. 创建表 + 链
```bash
nft add table inet filter
nft add chain inet filter input '{ type filter hook input priority 0; policy accept; }'
```

### 3. 允许端口
```bash
nft add rule inet filter input tcp dport 22 accept
nft add rule inet filter input tcp dport {80,443} accept
```

### 4. 删除规则
```bash
nft delete rule inet filter input handle 编号
```

## 六、网络管理工具（NetworkManager）
### nmcli 常用
```bash
nmcli device                          # 网卡列表
nmcli connection show                 # 连接配置
nmcli connection up eth0              # 启用
nmcli connection down eth0            # 停用
nmcli connection modify eth0 ipv4.addresses 192.168.1.10/24
nmcli connection modify eth0 ipv4.gateway 192.168.1.1
nmcli connection modify eth0 ipv4.dns 114.114.114.114
nmcli connection modify eth0 ipv4.method manual
```

## 七、常用网络排查组合（直接背）
```bash
ip a                  # 看 IP
ip r                  # 看网关、路由
ss -tulnp             # 看端口占用
ping 网关             # 看内网通不通
ping 外网IP           # 看出口通不通
curl baidu.com        # 看 HTTP 通不通
nslookup baidu.com    # 看 DNS
```