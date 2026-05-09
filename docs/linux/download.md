# download
## wget 

### 1. 基础下载（最常用）
直接下载，自动保存为原文件名：
```bash
wget https://example.com/file.zip
```

### 2. 下载并指定保存名字
```bash
wget -O 新文件名.zip https://example.com/file.zip
```

### 3. 断点续传（下载断了继续）
```bash
wget -c https://example.com/bigfile.zip
```

### 4. 后台下载（关掉终端也继续）
```bash
wget -b https://example.com/bigfile.zip
```
日志会写到 `wget-log`。

### 5. 下载多个文件
```bash
wget https://a.com/1.zip https://a.com/2.zip
```

### 6. 递归下载整个网站
- --recursive
- 默认递归深度：5 层
```bash
wget -r https://example.com
```

### --mirror

镜像模式核心作用：整站递归下载+增量更新+保留目录结构，适合离线浏览与备份**。

#### 一、镜像模式等价参数
`--mirror`（简写`-m`）等价于：
- -r（递归） 
- -N（时间戳增量） 
- -l inf（无限深度） 
- --no-remove-listing


#### 二、常用组合参数（必记）
```bash
wget -m -p -k -E -np URL
```
- `-m`：镜像模式（递归+增量）
- `-p`/`--page-requisites`：下载页面所有资源（CSS/JS/图片）
- `-k`/`--convert-links`：链接转本地相对路径（离线可用）
- `-E`/`--adjust-extension`：自动补`.html`后缀
- `-np`/`--no-parent`：不爬上级目录（限制范围）

#### 三、常用示例
1. **整站镜像（离线浏览）**
```bash
wget -m -p -k -E -np https://example.com/
```

2. **镜像到指定目录**
```bash
wget -m -p -k -E -np -P ./mirror https://example.com/
```

3. **忽略robots.txt（慎用）**
```bash
wget -m -p -k -E -np -e robots=off https://example.com/
```

4. **限制带宽与间隔（友好爬虫）**
```bash
wget -m -p -k -E -np -w 2 --limit-rate=500k https://example.com/
```

#### 四、目录结构控制
- `-nH`：不创建主机名目录（如`example.com/`）
- `--cut-dirs=N`：跳过N层远程目录
```bash
# 去掉example.com/一层目录
wget -m -nH --cut-dirs=1 https://example.com/
```

#### 五、增量更新
直接重复执行相同镜像命令，**仅下载更新文件**（依赖`-N`时间戳）。

### 7. 限速下载（不占满带宽）
```bash
wget --limit-rate=1M https://example.com/file.zip
```

### 8. 带用户名密码下载
```bash
wget --user=账号 --password=密码 https://example.com/file.zip
```

### wget 常用参数小结
- `-O`：指定保存文件名
- `-c`：断点续传
- `-b`：后台下载
- `--limit-rate`：限速
- `-r`：递归下载

## curl 详细教程
### 1. 查看网页内容（不保存）
```bash
curl https://www.baidu.com
```

### 2. 下载文件（保存到本地）
使用**原文件名**：
```bash
curl -O https://example.com/file.zip
```

自定义文件名：
```bash
curl -o myfile.zip https://example.com/file.zip
```

### 3. 断点续传
```bash
curl -C - -O https://example.com/bigfile.zip
```

### 4. 只看响应头（测网站、排错）
```bash
curl -I https://www.baidu.com
```

### 5. 发送 POST 请求（测接口最常用）
```bash
curl -X POST https://api.xxx.com/login
```

### 6. POST 带 JSON 数据
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456"}' \
  https://api.xxx.com/login
```

### 7. 带请求头（Token、Cookie）
```bash
curl -H "Authorization: Bearer xxxxx" https://api.xxx.com/user
```

### 8. 跟随跳转（301/302）
```bash
curl -L https://shorturl.example.com
```

### 9. 显示详细请求过程（调试）
```bash
curl -v https://www.baidu.com
```

### curl 常用参数小结
- `-O`：保存为原文件名
- `-o`：自定义文件名
- `-I`：只看响应头
- `-L`：跟随跳转
- `-X POST`：指定请求方法
- `-H`：请求头
- `-d`：发送数据
- `-v`：详细调试
- `-C -`：断点续传
