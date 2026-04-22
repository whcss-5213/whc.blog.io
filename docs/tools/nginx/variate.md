# Nginx 内置变量速查表

| 变量 | 说明 |
| :--- | :--- |
| $args | 请求中的参数值 |
| $query_string | 同 $args |
| $arg_NAME | GET 请求中 NAME 对应的值 |
| $is_args | 如果请求中有参数，值为 "?"，否则为空 |
| $uri | 当前 URI（不带参数），可通过内部重定向修改，不包含主机名 |
| $document_uri | 同 $uri |
| $document_root | 当前请求的文档根目录或 alias |
| $host | 主机名优先级：请求行主机名 > Host 请求头 > 服务器名 |
| $hostname | 系统主机名 |
| $https | 开启 SSL 为 on，否则为空 |
| $binary_remote_addr | 客户端地址二进制形式，固定 4 字节 |
| $body_bytes_sent | 发送给客户端的字节数，不含响应头 |
| $bytes_sent | 发送给客户端的总字节数 |
| $connection | TCP 连接序列号 |
| $connection_requests | 当前 TCP 连接的请求数 |
| $content_length | 请求头 Content-Length |
| $content_type | 请求头 Content-Type |
| $cookie_name | 对应 cookie 名称的值 |
| $limit_rate | 限制响应速度 |
| $msec | 当前 Unix 时间戳 |
| $nginx_version | Nginx 版本 |
| $pid | 工作进程 PID |
| $pipe | 管道请求为 p，否则为 . |
| $proxy_protocol_addr | 代理协议带来的客户端地址 |
| $realpath_root | 真实路径，会解析符号链接 |
| $remote_addr | 客户端 IP |
| $remote_port | 客户端端口 |
| $remote_user | HTTP 基础认证用户名 |
| $request | 完整请求行 |
| $request_body | 请求主体内容 |
| $request_body_file | 存储请求体的临时文件 |
| $request_completion | 请求成功为 OK，否则为空 |
| $request_filename | 当前请求对应的文件路径 |
| $request_length | 请求总长度（地址+头+体） |
| $request_method | 请求方法 GET/POST 等 |
| $request_time | 请求处理耗时，秒级（带毫秒精度） |
| $request_uri | 原始完整 URI（含参数），不可修改 |
| $scheme | 协议 http / https |
| $server_addr | 服务器地址 |
| $server_name | 服务器名称 |
| $server_port | 服务器端口 |
| $server_protocol | HTTP 版本，如 HTTP/1.1 |
| $status | HTTP 响应状态码 |
| $time_iso8601 | ISO 8601 格式时间 |
| $time_local | 日志格式的本地时间 |

##  请求头相关变量

| 变量 | 说明 |
| :--- | :--- |
| $cookie_NAME | 客户端 Cookie 中 NAME 对应的值 |
| $http_NAME | 任意请求头，如 $http_accept_language |
| $http_cookie | 完整 Cookie 头 |
| $http_host | 请求中的 Host（域名/IP） |
| $http_referer | 来源页面地址 |
| $http_user_agent | 客户端浏览器/设备信息 |
| $http_x_forwarded_for | 透传的客户端 IP（经过代理时） |

## 响应头相关变量

| 变量 | 说明 |
| :--- | :--- |
| $sent_http_NAME | 任意响应头，如 $sent_http_content_type |
| $sent_http_cache_control | 响应头 Cache-Control |
| $sent_http_connection | Connection |
| $sent_http_content_type | Content-Type |
| $sent_http_keep_alive | Keep-Alive |
| $sent_http_last_modified | Last-Modified |
| $sent_http_location | Location |
| $sent_http_transfer_encoding | Transfer-Encoding |