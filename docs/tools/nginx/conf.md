# conf
```nginx
user root;
worker_processes auto;
pid /run/nginx.pid;
error_log /var/log/nginx/error.log;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 768;
}

http {
    sendfile on;
    tcp_nopush on;
    types_hash_max_size 2048;
    # server_tokens off;

    # server_names_hash_bucket_size 64;
    # server_name_in_redirect off;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    ##
    # SSL Settings
    ##
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    ##
    # Logging Settings
    ##
    access_log /var/log/nginx/access.log;

    ##
    # Gzip Settings
    ##
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    ##
    # Virtual Host Configs
    ##
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
    include /path/to/nginx/conf/vhost/*.conf;

    # HTTP to HTTPS
    server {
        listen 80;
        server_tokens off;
        server_name example.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name example.com www.example.com;
        server_tokens off;

        # 禁止访问敏感文件/目录
        location ~ /\.(env|git|svn|htaccess|htpasswd|bak|backup|swp)$ {
            deny all;
            return 404;
        }
        location ~ ^/(\.git|\.svn|\.idea|node_modules|vendor) {
            deny all;
            return 404;
        }
        location ~ /\. {
            deny all;
            return 404;
        }

        # 安全头
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

        # SSL 证书
        ssl_certificate      /path/to/ssl/cert.pem;
        ssl_certificate_key  /path/to/ssl/cert.key;

        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;
        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;

        # 主站点
        location / {
            root   /path/to/website/html;
            index  index.html index.htm;
        }

        # 博客
        location /blog {
            root /path/to/website/html;
            try_files $uri $uri.html $uri/ =404;
            error_page 404 /404.html;
            error_page 403 /404.html;

            location ~* ^/blog/assets/ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        # 新闻
        location /news {
            alias /path/to/website/html/news;
            index index.html index.htm;
            try_files $uri $uri/ @news_fallback;
            add_header Content-Security-Policy "connect-src 'self' https://api.iconify.design;";

            location ~* ^/news/assets/ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        location @news_fallback {
            rewrite ^/news/(.*)$ /news/index.html last;
        }

        # 编辑页
        location /edit {
            alias /path/to/website/html/edit;
            index index.html index.htm;
            try_files $uri $uri/ @edit_fallback;
            add_header Content-Security-Policy "connect-src 'self' https://api.iconify.design;";

            location ~* ^/edit/assets/ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        location @edit_fallback {
            rewrite ^/edit/(.*)$ /edit/index.html last;
        }

        # API 代理
        location /api/ {
            proxy_pass http://localhost:3000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 60s;
            proxy_read_timeout 60s;
            proxy_send_timeout 60s;
        }

        # 测试代理
        location /test/ {
            proxy_pass http://test_upstream;
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

    # 上游服务器
    upstream test_upstream {
        server 127.0.0.1:80;
        server 127.0.0.1:8090;
    }
}


```
