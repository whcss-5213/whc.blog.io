# Docker Desktop

https://blog.csdn.net/weixin_44244659/article/details/123283622

```she
# cmd 
# powershell 不支持
# 利用 mklink 做硬链接，注意加 /j ，记得替换用户名
mklink /j "C:\ProgramData\Docker" "D:\ProgramData\Docker"
mklink /j "C:\Program Files\Docker" "D:\Program Files\Docker"
mklink /j "C:\Users\你的用户名\AppData\Local\Docker" "D:\Users\你的用户名\AppData\Local\Docker"

# 另外注意在对应盘创建相应文件夹
mkdir "D:\ProgramData\Docker"
mkdir "D:\Program Files\Docker"
mkdir "D:\Users\你的用户名\AppData\Local\Docker"
```

mklink /j  "C:\Program Files\Python39"  "D:\Python\python-3.10.0-embed-amd64"

npm WARN deprecated puppeteer@14.4.1: < 19.2.0 is no longer supported

### ERROR

```shell
docker pull mongodb
# mongodb => mongo
Error response from daemon: pull access denied for mongodb, repository does not exist or may require 'docker login': denied: requested access to the resource is denied
```