# ssl

## 证书和私钥文件

#### .key - 私钥文件

- **全称**：Private Key
- **核心作用**：这是加密通信的核心密钥，属于**绝对保密**的文件，只有服务器自己持有。
- **通俗理解**：相当于你家的房门钥匙，只有你能拥有，绝对不能泄露给任何人。
- **特点**：
  
  - 用于解密客户端发来的加密数据，或对服务器发送的数据进行签名。
  - 常见格式有 RSA 或 ECC 类型，文件内容是纯文本（PEM 格式）或二进制（DER 格式）。
  - 示例内容（PEM 格式）：
    ```
    -----BEGIN PRIVATE KEY-----
    MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJ7+...（省略）
    -----END PRIVATE KEY-----
    ```

#### .csr - 证书签名请求文件

- **全称**：Certificate Signing Request
- **核心作用**：这是你向证书颁发机构（CA，如 Let's Encrypt、阿里云、VeriSign）申请证书时提交的“申请文件”。
- **通俗理解**：相当于你向公安局申请身份证时填写的“申请表”，里面包含你的基本信息（域名、公司信息等）和公钥，但不包含私钥。
- **特点**：
  - 生成时会基于你的 `.key` 私钥生成，包含公钥和申请者的身份信息（如域名、组织名称）。
  - CA 会验证 `.csr` 中的信息，验证通过后颁发 `.crt` 证书。
  - 示例内容（PEM 格式）：
    ```
    -----BEGIN CERTIFICATE REQUEST-----
    MIICrjCCAZYCAQAwaDELMAkGA1UEBhMCQ04xETAPBgNVBAgMCEJhbmd...（省略）
    -----END CERTIFICATE REQUEST-----
    ```

#### .crt - 证书文件

- **全称**：Certificate
- **核心作用**：CA 颁发的**正式证书文件**，包含公钥、域名、证书有效期、CA 签名等信息。
- **通俗理解**：相当于公安局给你颁发的“身份证”，证明你的服务器身份是合法的。
- **特点**：
  - 客户端（浏览器、APP）会验证这个证书的合法性，确认服务器是“可信的”。
  - 格式可以是 PEM（文本）或 DER（二进制），Windows 系统常把 `.crt` 识别为二进制格式。
  - 示例内容（PEM 格式）：
    ```
    -----BEGIN CERTIFICATE-----
    MIIGAzCCBVugAwIBAgIRAIIQz7DSQONZRGo3w2mjiuAwDQYJKoZIhvcNAQELBQAw
    -----END CERTIFICATE-----
    ```

#### .pem - 通用容器格式

- **全称**：Privacy Enhanced Mail（历史名称，现在已脱离邮件用途）
- **核心作用**：这不是一种“特定类型”的文件，而是**文本格式的容器**，可以装私钥、公钥、证书、CSR 等内容。
- **通俗理解**：相当于一个“文件袋”，可以装钥匙（.key）、身份证（.crt）、申请表（.csr），甚至可以把多个内容装在同一个 `.pem` 文件里（比如同时装私钥+证书）。
- **特点**：
  - 最常见的证书格式，所有主流服务器（Nginx、Apache、OpenSSL）都支持。
  - 内容以 `-----BEGIN XXX-----` 开头，`-----END XXX-----` 结尾，中间是 Base64 编码的内容。
  - 很多时候 `.crt`、`.key` 文件本质上也是 PEM 格式，只是后缀名不同（比如把 `.crt` 改名为 `.pem` 完全可以用）。

### 总结

1. `.key` 是私钥文件，核心保密，用于解密/签名；
2. `.csr` 是证书申请文件，用于向 CA 申请证书，包含公钥和身份信息；
3. `.crt` 是 CA 颁发的正式证书，证明服务器身份；
4. `.pem` 是通用文本容器格式，可封装私钥、证书、CSR 等，是最常用的证书格式。

简单记：`.key` 是钥匙，`.csr` 是申请表，`.crt` 是身份证，`.pem` 是装这些东西的文件袋。



## nginx 配置

### serve

```nginx
server {
    listen 443 ssl;
    server_name  bb.cc;

    ssl_certificate      cert.pem;
    ssl_certificate_key  cert.key;

    ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  5m;

    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;
}
```



### 一、两个文件的核心对应关系

|        配置项         |  对应文件  |       文件类型       |                           核心要求                           |
| :-------------------: | :--------: | :------------------: | :----------------------------------------------------------: |
|   `ssl_certificate`   | `cert.pem` | 证书文件（PEM 格式） | 必须是**文本格式**的证书，可包含服务器证书 + 中间证书（CA Bundle），以 `-----BEGIN CERTIFICATE-----` 开头 |
| `ssl_certificate_key` | `cert.key` | 私钥文件（PEM 格式） | 必须是和 `cert.pem` 配对的私钥，文本格式，以 `-----BEGIN PRIVATE KEY-----` 或 `-----BEGIN RSA PRIVATE KEY-----` 开头 |

### 二、文件的正确格式与验证

#### 1. 检查 `cert.pem` 是否有效

验证证书格式和内容：

```bash
# 查看证书基本信息（有效期、域名等）
openssl x509 -in /root/www/SSL/cert.pem -noout -text

# 快速检查证书有效期
openssl x509 -in /root/www/SSL/cert.pem -noout -dates
```

- 正常输出会显示证书的 `Subject`（包含域名）、`Not Before`（生效时间）、`Not After`（过期时间）等信息；
- 如果报错 `unable to load certificate`，说明文件格式错误（比如是 DER 二进制格式，需转换为 PEM）。

#### 2. 检查 `cert.key` 是否有效且与证书匹配

```bash
# 检查私钥格式
openssl rsa -in /root/www/SSL/cert.key -check

# 验证私钥和证书是否配对（核心！）
# 提取证书的公钥指纹
openssl x509 -in /root/www/SSL/cert.pem -noout -modulus | openssl md5
# 提取私钥的公钥指纹
openssl rsa -in /root/www/SSL/cert.key -noout -modulus | openssl md5
```

两步输出的 **MD5 值必须完全一致**，否则说明私钥和证书不匹配，Nginx 启动会失败；

- 如果私钥有密码保护，会提示输入密码，建议移除密码（Nginx 不支持带密码的私钥，启动时会卡住）：

  ```bash
  # 移除私钥密码
  openssl rsa -in /root/www/SSL/cert.key -out /root/www/SSL/cert_nopass.key
  # 替换原文件（记得备份）
  cp /root/www/SSL/cert_nopass.key /root/www/SSL/cert.key
  ```

  

