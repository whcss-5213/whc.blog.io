# nginx

## gzip

```nginx configuration
http {
    # 开启 gzip 
    gzip on;
    # 超过1K的文件才压缩
    gzip_min_length 1k;
    # 设置gzip申请内存的大小,
    # 设置压缩缓冲区大小，此处设置为4个16K内存作为压缩结果流缓存
    gzip_buffers 4 16k;
    # 启用gzip压缩所需的HTTP最低版本
    gzip_http_version 1.1;
    # 压缩级别（1-9），压缩比率越高，文件被压缩的体积越小
    gzip_comp_level 2;
    # 进行压缩的文件类型
    gzip_types text/plain application/javascript application/x-javascript text/javascript text/css application/xml;
    # 配置禁用gzip条件，支持正则。此处表示ie6及以下不启用gzip（因为ie低版本不支持）
    gzip_disable "MSIE [1-6]\.";
    # 启用应答头"Vary: Accept-Encoding"
    # 选择支持vary header；改选项可以让前端的缓存服务器缓存经过gzip压缩的页面;
    gzip_vary on;
}
```

## location

### 匹配模式

1. 匹配符
2. @ 内部服务跳转
   查找顺序和优先级

| 符号  |               含义               |
|:---:|:------------------------------:|
|  =  | 精确匹配，优先级最高，大小写敏感，如果匹配成功就停止向下匹配 |
| ^~  |   表示普通字符串匹配到后不再进行正则匹配,区分大小写    |
|  ~  |         包含正则表达式，区分大小写          |
| ~*  |        包含正则表达式，并且不区分大写         |
| !~  |         表示区分大小写不匹配的正则          |
| !~* |         表示不区分大小写不匹配的正则         |
|  /  |         通用匹配，任何请求都会匹配到         |

常用变量的值：

```nginx configuration
location = / {
}
location ^~ /static {
}
location ~ /abc {
}
location ~* .jpg$ {
}
location / {
}
```

- = 等于，严格匹配.

- ^~

- ~ 区分大小写

- ~* 不区分大小写

2. 优先级

    1. 精确匹配（=）
    2. 前缀匹配（^~）
    3. 正则匹配（~和～*）
    4. 不写

### HTTP 反向代理

#### 1.proxy_pass

```nginx configuration
# http://a.com/some/path/a.html
location /some/path/ {
    proxy_pass http://localhost:8088;
    # http://localhost:8088/some/path/a.html
}

location /some/path/ {
    proxy_pass http://localhost:8088/;
    # http://localhost:8088/a.html
}
```

#### 2.设置代理请求headers

```nginx configuration
location /some/path/ {
    #nginx的主机地址
    proxy_set_header Host $http_host;
    #用户端真实的IP，即客户端IP
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    proxy_pass http://localhost:8088;
}
```

常用变量的值：

- \$host：nginx主机IP，例如192.168.56.105
- \$http_host：nginx主机IP和端口，192.168.56.105:8001
- \$proxy_host：localhost:8088，proxy_pass里配置的主机名和端口
- \$remote_addr:用户的真实IP，即客户端IP。

#### 3.非HTTP代理

如果要将请求传递到非 HTTP 代理服务器，可以使用下列指令：
- fastcgi_pass 将请求转发到FastCGI服务器（多用于PHP）
- scgi_pass 将请求转发到SCGI server服务器（多用于PHP）
- uwsgi_pass 将请求转发到uwsgi服务器（多用于python）
- memcached_pass 将请求转发到memcached服务器

### 重定向

#### return

功能：

- 停止处理请求，直接返回响应码或重定向到其他URL
- 执行return指令后，location中后续指令将不会被执行

语法：

```nginx configuration
location {
   return code [text] (200 "return 200");
   return code URL(301 /download/); 
   return URL(具体RUL路径 www.a.com/download);
}
```

重定向状态码有：

301：永久重定向（HTTP1.0标准）
302：临时重定向，禁止被缓存（HTTP1.0标准）
303：临时重定向，禁止被缓存，允许改变方法（HTTP2.0标准）
307：临时重定向，禁止被缓存，不允许改变方法（HTTP2.0标准）
308：永久重定向，不允许改变方法（HTTP2.0标准）

#### rewrite

功能：rewrite指令能够根据匹配的正则表达式，重写URL。
语法：`rewrite regex replacement [flag]`

- last：重写后的URL发起新请求，再次进入server段，重试location中的匹配
- break：直接使用重写后的URL，不再匹配其他location中的语句
- redirect：返回302临时重定向
- permanent：返回301永久重定向

```nginx configuration
location /images {
  rewrite /images/(.*) /download/$1;
}
```
