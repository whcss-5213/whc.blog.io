# Referer 防盗链配置与说明

## Nginx location 配置
```nginx
location ~* \.(gif|jpg|jpeg|png|bmp|swf|flv|mp4|webp|ico)$ {
    # 允许空 Referer（直接访问）
    valid_referers none blocked maquge.com *.maquge.com;
    
    if ($invalid_referer) {
        # 返回 403 或重定向到警告图片
        return 403;
    }
    
    # 可选：为合法请求添加缓存头
    expires 30d;
    access_log off;
}
```

### 参数说明
- `none`：允许用户直接输入 URL 访问（无 Referer）
- `blocked`：允许 Referer 被防火墙或浏览器插件隐藏的情况
- `maquge.com`：精确匹配主域名
- `*.maquge.com`：匹配所有子域名

### `$invalid_referer` 变量
- Referer 不匹配规则时，值为 `1`
- 匹配合法域名时，值为空

## 局限性

| 局限 | 说明 |
| :--- | :--- |
| Referer 可被伪造 | 恶意用户/爬虫可以构造合法的 Referer 头 |
| 部分请求无 Referer | 隐私模式、HTTPS→HTTP、浏览器插件等会移除 Referer |
| 并非安全机制 | 只是“君子协定”，不能替代身份验证 |
| CDN/缓存层问题 | 前端有 CDN 时，需在 CDN 层同步配置防盗链 |