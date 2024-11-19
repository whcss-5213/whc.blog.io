# ssl

## 证书和私钥文件

- xxxx.key
- xxxx.pem

## serve

```nginx configuration
server {
    listen 443 ssl;
    server_name  bb.cc;
    
    ssl_certificate      cert.pem;
    ssl_certificate_key  cert.key;
    
    ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  5m;
    
    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;
    
    location / {
    
    }
}

```