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

### 6. 递归下载整个网站（慎用）
```bash
wget -r https://example.com
```

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
