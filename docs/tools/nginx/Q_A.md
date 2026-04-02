# QA

## merge_slashes

```nginx
http {
    # 默认就是 on，一般不用写
    merge_slashes on;
    ...
}
```
- 请求： /api//v1//user 
​
- Nginx 内部标准化： /api/v1/user 
​
-  $uri  = 合并后路径
​
-  $request_uri  = 原始完整 URL（含  // ）
