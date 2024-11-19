# upstream

## 负载均衡

### 1. 轮循机制（round-robin）

每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器down掉，能自动剔除。

   ```nginx configuration
   upstream ruoyi-apps {
      server localhost:8080;
      server localhost:8088;
   }
   
   server {
       listen 8003;
       server_name ruoyi.loadbalance;
       location / {
           proxy_pass http://ruoyi-apps;
       }
   }
   ```

### 2. 最小连接（least-connected ）

将下一个请求分配给活动连接数最少的服务器（较为空闲的服务器）。

   ```nginx configuration
   upstream backend {
       least_conn;
       server 192.168.0.14;
       server 192.168.0.15;
   }
   ```

### 3. 指定权重 （weight）

   ```nginx configuration
   upstream backserver { 
      server 192.168.0.14 weight=8; 
      server 192.168.0.15 weight=10; 
   } 
   ```

### 4. 随机 (random）

每个请求都将传递到随机选择的服务器。

two是可选参数，NGINX 在考虑服务器权重的情况下随机选择两台服务器，然后使用指定的方法选择其中一台，默认为选择连接数最少（least_conn‎）的服务器。

   ```nginx configuration
   upstream backend {
       random two least_conn;
       server backend1.example.com;
       server backend2.example.com;
       server backend3.example.com;
       server backend4.example.com;
   }
   ```

### 5. IP 绑定 ip_hash

客户端的 IP 地址将用作哈希键，来自同一个ip的请求会被转发到相同的服务器。

   ```nginx configuration
   upstream backend {
       ip_hash;
       server backend1.example.com;
       server backend2.example.com;
   }
   ```

此方法可确保来自同一客户端的请求将始终定向到同一服务器，除非此服务器不可用。‎

### 6. 通用hash

通用hash，允许用户自定义hash的key，key可以是字符串、变量或组合。

例如，key可以是配对的源 IP 地址和端口，也可以是 URI，如以下示例所示：‎

   ```nginx configuration
   upstream backend {
       hash $request_uri consistent;
       server backend1.example.com;
       server backend2.example.com;
   }
   ```

请注意：基于 IP 的哈希算法存在一个问题，那就是当有一个上游服务器宕机或者扩容的时候，会引发大量的路由变更，进而引发连锁反应，导致大量缓存失效等问题。

### 7. 健康检查

在反向代理中，如果后端服务器在某个周期内响应失败次数超过规定值，nginx会将此服务器标记为失败，并在之后的一个周期不再将请求发送给这台服务器。‎

通过[fail_timeout‎](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#fail_timeout)‎ 来设置检查周期，默认为10秒。

通过[max_fails‎](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#max_fails)来设置检查失败次数，默认为1次。‎

   ```nginx configuration
   upstream backend {
     server backend1.example.com;
     server backend2.example.com max_fails=3 fail_timeout=30s; 
   } 
   ```
